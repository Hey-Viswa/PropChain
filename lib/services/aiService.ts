/**
 * lib/services/aiService.ts
 *
 * Phase 3 — AI document verification pipeline (free by default).
 *
 * Pipeline: OCR text -> heuristic field extraction -> fraud rules -> score.
 *
 * Cost model (all free):
 *  - OCR: Tesseract.js (local, Apache-2.0). Loaded lazily and optionally, so it
 *    is NOT bundled unless installed. Callers may also pass pre-extracted text
 *    (e.g. from client-side OCR or a copy/paste), which needs no OCR at all.
 *  - Field extraction + fraud rules: pure local heuristics (this file +
 *    fraudDetection.ts). No paid LLM API is required.
 *
 * An optional advanced provider hook is exposed so a *free-tier* LLM key (e.g.
 * Google Gemini's free tier) can be plugged in later without changing callers.
 */
import {
  detectFraud,
  type ExtractedFields,
  type FraudContext,
  type FraudFlag,
} from "./fraudDetection";

export type { ExtractedFields, FraudContext, FraudFlag };

export interface OcrInput {
  /** Pre-extracted text (skips OCR entirely). */
  text?: string;
  /** Raw document bytes for OCR. */
  buffer?: Buffer | Uint8Array;
  /** Data URL or remote URL for OCR. */
  url?: string;
}

export type OcrFn = (input: OcrInput) => Promise<string>;

export type Decision = "auto_pass" | "review" | "reject";

export interface VerifyResult {
  overallScore: number; // 0..100
  decision: Decision;
  fields: ExtractedFields;
  fraudFlags: FraudFlag[];
  perField: Record<string, number>; // 0..100 confidence per field
  ocrTextLength: number;
  provider: string;
}

/** Heuristic extraction tuned for Indian sale-deed / survey text. */
export function extractFields(text: string): ExtractedFields {
  const fields: ExtractedFields = {};

  // ULPIN — 2 uppercase letters + 10 digits (e.g. MH0123456789).
  const ulpin = text.match(/\b([A-Z]{2}\d{10})\b/);
  fields.ulpin = ulpin ? ulpin[1] : null;

  // Area — "area ... 1,200 sq ft".
  const area = text.match(
    /area[^0-9]{0,15}([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*ft|sqft|square\s*feet)/i
  );
  fields.areaSqft = area ? Number(area[1].replace(/,/g, "")) : null;

  // Stamp duty — "stamp duty: Rs. 1,20,000".
  const stamp = text.match(
    /stamp\s*duty[^0-9]{0,15}(?:rs\.?|inr|₹)?\s*([\d,]+)/i
  );
  fields.stampDutyValue = stamp ? Number(stamp[1].replace(/,/g, "")) : null;

  // Registration date — DD/MM/YYYY or ISO.
  const date =
    text.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b/) ||
    text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  fields.registrationDate = date ? date[1] : null;

  // Names — capture the value after a labelled field.
  fields.sellerName = matchLabelledName(text, [
    "seller",
    "vendor",
    "transferor",
    "first party",
  ]);
  fields.buyerName = matchLabelledName(text, [
    "buyer",
    "purchaser",
    "transferee",
    "second party",
  ]);

  // Address.
  const addr = text.match(/(?:property\s*address|address|situated\s*at)\s*[:\-]\s*(.+)/i);
  fields.propertyAddress = addr ? addr[1].trim().slice(0, 200) : null;

  return fields;
}

function matchLabelledName(text: string, labels: string[]): string | null {
  for (const label of labels) {
    // Capture only same-line name characters (letters, spaces, dots); the class
    // deliberately excludes newlines so it stops at the end of the line.
    const re = new RegExp(`${label}[ \\t]*(?:name)?[ \\t]*[:\\-][ \\t]*([A-Za-z][A-Za-z. ]{2,60})`, "i");
    const m = text.match(re);
    if (m) return m[1].trim().replace(/\s+/g, " ");
  }
  return null;
}

const FIELD_WEIGHTS: Record<keyof ExtractedFields, number> = {
  ulpin: 30,
  sellerName: 15,
  buyerName: 15,
  propertyAddress: 15,
  areaSqft: 15,
  registrationDate: 5,
  stampDutyValue: 5,
};

function fieldCompleteness(fields: ExtractedFields): {
  score: number;
  perField: Record<string, number>;
} {
  let total = 0;
  let got = 0;
  const perField: Record<string, number> = {};
  (Object.keys(FIELD_WEIGHTS) as (keyof ExtractedFields)[]).forEach((k) => {
    const weight = FIELD_WEIGHTS[k];
    total += weight;
    const present = fields[k] !== null && fields[k] !== undefined && fields[k] !== "";
    if (present) got += weight;
    perField[k] = present ? 100 : 0;
  });
  return { score: total === 0 ? 0 : (got / total) * 100, perField };
}

const SEVERITY_PENALTY: Record<FraudFlag["severity"], number> = {
  high: 40,
  medium: 20,
  low: 8,
};

/** Composite confidence from field completeness minus fraud penalties. */
export function computeScore(
  fields: ExtractedFields,
  flags: FraudFlag[]
): { score: number; perField: Record<string, number> } {
  const { score: base, perField } = fieldCompleteness(fields);
  let score = base;
  for (const f of flags) score -= SEVERITY_PENALTY[f.severity];
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, perField };
}

function decide(score: number, flags: FraudFlag[]): Decision {
  const hasHigh = flags.some((f) => f.severity === "high");
  if (hasHigh || score < 50) return "reject";
  if (score >= 75) return "auto_pass";
  return "review";
}

/**
 * Run the full verification pipeline.
 * Pass `opts.ocr` to inject an OCR function (tests inject a mock); otherwise the
 * default lazy Tesseract OCR is used (only if text is not already provided).
 */
export async function verifyDocument(
  input: OcrInput,
  ctx: FraudContext = {},
  opts: { ocr?: OcrFn; provider?: string } = {}
): Promise<VerifyResult> {
  const ocr = opts.ocr ?? defaultOcr;
  const text = input.text ?? (await ocr(input));

  const fields = extractFields(text);
  const fraudFlags = detectFraud(fields, ctx);
  const { score, perField } = computeScore(fields, fraudFlags);
  const decision = decide(score, fraudFlags);

  return {
    overallScore: score,
    decision,
    fields,
    fraudFlags,
    perField,
    ocrTextLength: text.length,
    provider: opts.provider ?? (input.text ? "provided-text" : "tesseract"),
  };
}

/**
 * Default OCR. Lazily and optionally loads Tesseract.js. The module specifier
 * is computed so the bundler/typechecker does not require the package to be
 * installed; if it is missing we fail soft with empty text.
 */
async function defaultOcr(input: OcrInput): Promise<string> {
  if (input.text) return input.text;
  const source = input.buffer ?? input.url;
  if (!source) return "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specifier = ["tesseract", "js"].join(".");
    const tesseract: any = await import(/* webpackIgnore: true */ specifier);
    const worker = await tesseract.createWorker("eng");
    try {
      const { data } = await worker.recognize(source as never);
      return (data?.text as string) ?? "";
    } finally {
      await worker.terminate();
    }
  } catch {
    // Tesseract not installed or OCR unavailable in this environment.
    return "";
  }
}
