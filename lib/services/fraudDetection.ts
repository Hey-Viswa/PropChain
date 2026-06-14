/**
 * lib/services/fraudDetection.ts
 *
 * Phase 3 — fraud-signal rules for Indian property documents.
 *
 * Pure functions only (no I/O, no external API), so they run for free and are
 * fully unit-testable. Consumed by aiService to flag risky submissions.
 */

export interface ExtractedFields {
  sellerName?: string | null;
  buyerName?: string | null;
  propertyAddress?: string | null;
  ulpin?: string | null;
  areaSqft?: number | null;
  stampDutyValue?: number | null;
  registrationDate?: string | null; // ISO (YYYY-MM-DD) or DD/MM/YYYY
}

export interface FraudContext {
  /** Name on the submitter's KYC record (for seller/buyer cross-check). */
  kycName?: string;
  /** ULPINs already registered (on-chain or DB) — for duplicate detection. */
  existingUlpins?: string[];
  /** ULPIN entered in the submission form. */
  formUlpin?: string | null;
  /** Area entered in the submission form (sq ft). */
  formArea?: number | null;
  /** Local circle rate per sq ft, for a stamp-duty sanity check. */
  circleRatePerSqft?: number;
  /** Override "now" (epoch ms) for deterministic tests. */
  now?: number;
}

export type FraudSeverity = "low" | "medium" | "high";

export interface FraudFlag {
  code: string;
  severity: FraudSeverity;
  message: string;
}

/** Classic Levenshtein edit distance. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/** Normalized similarity in [0,1]; 1 = identical (case/space-insensitive). */
export function nameSimilarity(a: string, b: string): number {
  const na = a.trim().toLowerCase().replace(/\s+/g, " ");
  const nb = b.trim().toLowerCase().replace(/\s+/g, " ");
  if (!na && !nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(na, nb) / maxLen;
}

/** Parse DD/MM/YYYY, DD-MM-YYYY, or ISO (YYYY-MM-DD) to epoch ms, or null. */
export function parseIndianDate(input: string): number | null {
  const s = input.trim();
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const t = Date.UTC(year, month - 1, day);
    return Number.isNaN(t) ? null : t;
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const t = Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isNaN(t) ? null : t;
  }
  return null;
}

const NAME_MISMATCH_THRESHOLD = 0.7;

/** Run all fraud rules against extracted fields + context. */
export function detectFraud(
  fields: ExtractedFields,
  ctx: FraudContext = {}
): FraudFlag[] {
  const flags: FraudFlag[] = [];
  const now = ctx.now ?? Date.now();

  // 1. Duplicate ULPIN — already registered. Hard block.
  if (fields.ulpin && ctx.existingUlpins?.length) {
    const known = ctx.existingUlpins.map((u) => u.toUpperCase());
    if (known.includes(fields.ulpin.toUpperCase())) {
      flags.push({
        code: "DUPLICATE_ULPIN",
        severity: "high",
        message: `ULPIN ${fields.ulpin} is already registered.`,
      });
    }
  }

  // 2. Form vs document ULPIN mismatch.
  if (ctx.formUlpin && fields.ulpin &&
      ctx.formUlpin.toUpperCase() !== fields.ulpin.toUpperCase()) {
    flags.push({
      code: "ULPIN_FORM_MISMATCH",
      severity: "high",
      message: `Form ULPIN (${ctx.formUlpin}) does not match document (${fields.ulpin}).`,
    });
  }

  // 3. Missing ULPIN in the document.
  if (!fields.ulpin) {
    flags.push({
      code: "MISSING_ULPIN",
      severity: "low",
      message: "No ULPIN could be extracted from the document.",
    });
  }

  // 4. Registration date in the future.
  if (fields.registrationDate) {
    const t = parseIndianDate(fields.registrationDate);
    if (t !== null && t > now) {
      flags.push({
        code: "FUTURE_DATE",
        severity: "high",
        message: `Registration date ${fields.registrationDate} is in the future.`,
      });
    }
  }

  // 5. KYC name vs document parties (Levenshtein).
  if (ctx.kycName) {
    const parties = [fields.sellerName, fields.buyerName].filter(
      (n): n is string => !!n
    );
    if (parties.length > 0) {
      const best = Math.max(...parties.map((p) => nameSimilarity(ctx.kycName!, p)));
      if (best < NAME_MISMATCH_THRESHOLD) {
        flags.push({
          code: "NAME_MISMATCH",
          severity: "medium",
          message: `KYC name does not closely match any party on the document (similarity ${best.toFixed(
            2
          )}).`,
        });
      }
    }
  }

  // 6. Declared area vs form area (>10% deviation).
  if (ctx.formArea && fields.areaSqft) {
    const deviation = Math.abs(fields.areaSqft - ctx.formArea) / ctx.formArea;
    if (deviation > 0.1) {
      flags.push({
        code: "AREA_MISMATCH",
        severity: "medium",
        message: `Document area (${fields.areaSqft}) deviates ${(deviation * 100).toFixed(
          0
        )}% from form area (${ctx.formArea}).`,
      });
    }
  }

  // 7. Stamp duty implausibly low vs circle rate.
  if (ctx.circleRatePerSqft && fields.areaSqft && fields.stampDutyValue) {
    const expectedFloor = fields.areaSqft * ctx.circleRatePerSqft * 0.5;
    if (fields.stampDutyValue < expectedFloor) {
      flags.push({
        code: "LOW_STAMP_DUTY",
        severity: "medium",
        message: `Stamp duty (${fields.stampDutyValue}) is below 50% of the circle-rate estimate.`,
      });
    }
  }

  return flags;
}
