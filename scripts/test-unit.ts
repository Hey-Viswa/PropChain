/**
 * scripts/test-unit.ts
 *
 * Lightweight, dependency-free unit-test runner for the pure service logic
 * (audit hash chain, fraud detection, AI extraction/scoring). The app has no
 * jest/vitest; this keeps testing free and fast.
 *
 *   npm run test:unit      (== tsx scripts/test-unit.ts)
 *
 * Imports use relative paths (not the @/ alias) so they resolve under tsx.
 */
import assert from "node:assert/strict";

import {
  buildChain,
  appendEntry,
  verifyChain,
  computeEntryHash,
  GENESIS_PREV_HASH,
  type AuditEntry,
} from "../lib/services/auditChain";
import {
  detectFraud,
  levenshtein,
  nameSimilarity,
  parseIndianDate,
} from "../lib/services/fraudDetection";
import {
  extractFields,
  computeScore,
  verifyDocument,
} from "../lib/services/aiService";

// ── tiny harness ─────────────────────────────────────────────────────────────
type TestFn = () => void | Promise<void>;
const cases: { name: string; fn: TestFn }[] = [];
let current = "";
function describe(name: string, fn: () => void) {
  current = name;
  fn();
  current = "";
}
function it(name: string, fn: TestFn) {
  cases.push({ name: `${current} › ${name}`, fn });
}

// ── auditChain ───────────────────────────────────────────────────────────────
describe("auditChain", () => {
  const inputs = [
    { action: "REGISTER", actor: "0xabc", tokenId: 1, timestamp: 1000, data: { ulpin: "MH0123456789" } },
    { action: "APPROVE", actor: "0xoracle", tokenId: 1, timestamp: 2000 },
    { action: "TRANSFER", actor: "0xabc", tokenId: 1, timestamp: 3000, data: { to: "0xdef" } },
  ];

  it("first entry links to the genesis hash", () => {
    const chain = buildChain(inputs);
    assert.equal(chain[0].prevHash, GENESIS_PREV_HASH);
    assert.equal(chain[0].index, 0);
  });

  it("each entry links to the previous hash", () => {
    const chain = buildChain(inputs);
    assert.equal(chain[1].prevHash, chain[0].hash);
    assert.equal(chain[2].prevHash, chain[1].hash);
  });

  it("verifies a valid chain", () => {
    const chain = buildChain(inputs);
    assert.deepEqual(verifyChain(chain), { valid: true, brokenAt: null });
  });

  it("detects tampering with an entry's data", () => {
    const chain = buildChain(inputs);
    const tampered: AuditEntry[] = JSON.parse(JSON.stringify(chain));
    tampered[0].data = { ulpin: "ZZ9999999999" }; // forge the genesis record
    const result = verifyChain(tampered);
    assert.equal(result.valid, false);
    assert.equal(result.brokenAt, 0);
  });

  it("detects a deleted/reordered entry", () => {
    const chain = buildChain(inputs);
    const reordered = [chain[0], chain[2]]; // drop the middle entry
    const result = verifyChain(reordered);
    assert.equal(result.valid, false);
  });

  it("computeEntryHash is deterministic", () => {
    const base = { index: 0, action: "X", actor: "a", tokenId: 1, timestamp: 5, prevHash: GENESIS_PREV_HASH };
    assert.equal(computeEntryHash(base), computeEntryHash({ ...base }));
  });

  it("appendEntry extends an existing chain", () => {
    const chain = buildChain(inputs.slice(0, 2));
    const next = appendEntry(chain, inputs[2]);
    assert.equal(next.index, 2);
    assert.equal(next.prevHash, chain[1].hash);
  });
});

// ── fraudDetection ───────────────────────────────────────────────────────────
describe("fraudDetection", () => {
  it("levenshtein basic distances", () => {
    assert.equal(levenshtein("kitten", "sitting"), 3);
    assert.equal(levenshtein("", "abc"), 3);
    assert.equal(levenshtein("same", "same"), 0);
  });

  it("nameSimilarity is case/space insensitive", () => {
    assert.equal(nameSimilarity("Aryan Sharma", "aryan  sharma"), 1);
    assert.ok(nameSimilarity("Aryan Sharma", "Rohit Verma") < 0.5);
  });

  it("parseIndianDate handles DD/MM/YYYY and ISO", () => {
    assert.equal(parseIndianDate("15/08/2024"), Date.UTC(2024, 7, 15));
    assert.equal(parseIndianDate("2024-08-15"), Date.UTC(2024, 7, 15));
    assert.equal(parseIndianDate("not a date"), null);
    assert.equal(parseIndianDate("45/13/2024"), null);
  });

  it("flags duplicate ULPIN as high severity", () => {
    const flags = detectFraud(
      { ulpin: "MH0123456789" },
      { existingUlpins: ["mh0123456789"] }
    );
    const dup = flags.find((f) => f.code === "DUPLICATE_ULPIN");
    assert.ok(dup);
    assert.equal(dup!.severity, "high");
  });

  it("flags future registration dates", () => {
    const now = Date.UTC(2024, 0, 1);
    const flags = detectFraud({ ulpin: "MH0123456789", registrationDate: "01/01/2030" }, { now });
    assert.ok(flags.some((f) => f.code === "FUTURE_DATE"));
  });

  it("flags KYC name mismatch", () => {
    const flags = detectFraud(
      { ulpin: "MH0123456789", sellerName: "Rohit Verma", buyerName: "Sunita Rao" },
      { kycName: "Aryan Sharma" }
    );
    assert.ok(flags.some((f) => f.code === "NAME_MISMATCH"));
  });

  it("does NOT flag a close KYC name match", () => {
    const flags = detectFraud(
      { ulpin: "MH0123456789", buyerName: "Aryan Sharma" },
      { kycName: "Aryan Sharma" }
    );
    assert.ok(!flags.some((f) => f.code === "NAME_MISMATCH"));
  });

  it("flags area mismatch beyond 10%", () => {
    const flags = detectFraud({ ulpin: "MH0123456789", areaSqft: 2000 }, { formArea: 1000 });
    assert.ok(flags.some((f) => f.code === "AREA_MISMATCH"));
  });

  it("flags form/document ULPIN mismatch", () => {
    const flags = detectFraud(
      { ulpin: "MH0123456789" },
      { formUlpin: "KA1122334455" }
    );
    assert.ok(flags.some((f) => f.code === "ULPIN_FORM_MISMATCH"));
  });

  it("returns no flags for a clean submission", () => {
    const flags = detectFraud(
      { ulpin: "MH0123456789", sellerName: "Aryan Sharma", areaSqft: 1200, registrationDate: "01/01/2020" },
      { kycName: "Aryan Sharma", formUlpin: "MH0123456789", formArea: 1200, now: Date.UTC(2024, 0, 1) }
    );
    assert.deepEqual(flags, []);
  });
});

// ── aiService ────────────────────────────────────────────────────────────────
const SAMPLE_DEED = `
SALE DEED (VIKRAY PATRA)
Seller Name: Aryan Sharma
Buyer Name: Rohit Verma
Property Address: 12, Shivaji Nagar, Pune
ULPIN: MH0123456789
Area: 1,200 sq ft
Stamp Duty: Rs. 1,20,000
Registration Date: 15/08/2020
`;

describe("aiService.extractFields", () => {
  it("extracts ULPIN, area, dates, names", () => {
    const f = extractFields(SAMPLE_DEED);
    assert.equal(f.ulpin, "MH0123456789");
    assert.equal(f.areaSqft, 1200);
    assert.equal(f.stampDutyValue, 120000);
    assert.equal(f.registrationDate, "15/08/2020");
    assert.equal(f.sellerName, "Aryan Sharma");
    assert.equal(f.buyerName, "Rohit Verma");
  });

  it("returns null ulpin when absent", () => {
    const f = extractFields("no identifiers here");
    assert.equal(f.ulpin, null);
  });
});

describe("aiService.computeScore", () => {
  it("high score for complete fields with no flags", () => {
    const fields = extractFields(SAMPLE_DEED);
    const { score } = computeScore(fields, []);
    assert.ok(score >= 90, `expected >=90, got ${score}`);
  });

  it("penalizes high-severity flags", () => {
    const fields = extractFields(SAMPLE_DEED);
    const clean = computeScore(fields, []).score;
    const flagged = computeScore(fields, [
      { code: "DUPLICATE_ULPIN", severity: "high", message: "x" },
    ]).score;
    assert.ok(flagged < clean);
    assert.equal(flagged, Math.max(0, clean - 40));
  });
});

describe("aiService.verifyDocument", () => {
  it("auto-passes a clean deed via injected OCR", async () => {
    const result = await verifyDocument(
      { url: "doc://sample" },
      { kycName: "Aryan Sharma", formUlpin: "MH0123456789", formArea: 1200, now: Date.UTC(2024, 0, 1) },
      { ocr: async () => SAMPLE_DEED }
    );
    assert.equal(result.decision, "auto_pass");
    assert.equal(result.fraudFlags.length, 0);
    assert.equal(result.fields.ulpin, "MH0123456789");
    assert.ok(result.ocrTextLength > 0);
  });

  it("rejects a deed with a duplicate ULPIN", async () => {
    const result = await verifyDocument(
      { text: SAMPLE_DEED },
      { existingUlpins: ["MH0123456789"], now: Date.UTC(2024, 0, 1) }
    );
    assert.equal(result.decision, "reject");
    assert.ok(result.fraudFlags.some((f) => f.code === "DUPLICATE_ULPIN"));
    assert.equal(result.provider, "provided-text");
  });

  it("returns empty text when no OCR source and no text", async () => {
    const result = await verifyDocument({}, {}, { ocr: async () => "" });
    assert.equal(result.ocrTextLength, 0);
    assert.equal(result.decision, "reject");
  });
});

// ── run ──────────────────────────────────────────────────────────────────────
(async () => {
  let passed = 0;
  let failed = 0;
  for (const t of cases) {
    try {
      await t.fn();
      passed++;
      console.log(`  ✓ ${t.name}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${t.name}`);
      console.error(`      ${(err as Error).message}`);
    }
  }
  console.log(`\n${passed} passing, ${failed} failing`);
  if (failed > 0) process.exit(1);
})();
