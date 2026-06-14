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
import {
  canonicalize,
  issueCredential,
  verifyCredential,
} from "../lib/services/credentialService";
import { generateMatrix, toSvg } from "../lib/qrcode";

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

// ── credentialService ────────────────────────────────────────────────────────
const CRED_INPUT = {
  tokenId: 9001,
  ulpin: "MH0123456789",
  owner: "0x1111111111111111111111111111111111111111",
  physicalAddress: "12, Shivaji Nagar, Pune",
  areaSqFt: 1200,
  propertyType: "Residential",
  status: "approved",
  registeredAt: "2025-01-01T00:00:00.000Z",
  chainId: 31337,
  issuedAt: "2026-01-01T00:00:00.000Z",
};

describe("credentialService", () => {
  it("canonicalize sorts keys deterministically", () => {
    assert.equal(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
    assert.equal(canonicalize({ a: 2, b: 1 }), '{"a":2,"b":1}');
    assert.equal(canonicalize([3, { y: 1, x: 2 }]), '[3,{"x":2,"y":1}]');
  });

  it("issues a W3C VC with the expected shape", () => {
    const vc = issueCredential(CRED_INPUT);
    assert.ok(vc["@context"].includes("https://www.w3.org/2018/credentials/v1"));
    assert.ok(vc.type.includes("PropertyOwnershipCredential"));
    assert.equal(vc.credentialSubject.ulpin, "MH0123456789");
    assert.equal(vc.credentialSubject.id, "did:pkh:eip155:31337:0x1111111111111111111111111111111111111111");
    assert.ok(vc.proof && vc.proof.proofValue.length === 64);
  });

  it("verifies a freshly issued credential", () => {
    const vc = issueCredential(CRED_INPUT);
    assert.deepEqual(verifyCredential(vc), { valid: true, reason: null });
  });

  it("detects tampering with the subject", () => {
    const vc = issueCredential(CRED_INPUT);
    vc.credentialSubject.owner = "0x2222222222222222222222222222222222222222" as never;
    vc.credentialSubject.ulpin = "ZZ9999999999";
    assert.equal(verifyCredential(vc).valid, false);
  });

  it("is deterministic for a fixed issuedAt", () => {
    const a = issueCredential(CRED_INPUT);
    const b = issueCredential(CRED_INPUT);
    assert.equal(a.proof!.proofValue, b.proof!.proofValue);
  });
});

// ── qrcode ───────────────────────────────────────────────────────────────────
describe("qrcode", () => {
  it("selects version 1 (21×21) for short payloads", () => {
    const m = generateMatrix("hello");
    assert.equal(m.length, 21);
    assert.equal(m[0].length, 21);
  });

  it("places the three finder patterns", () => {
    const m = generateMatrix("https://propchain.example/certificate/9001");
    const size = m.length;
    // Finder = 3×3 dark block · light ring · dark border (Chebyshev distance).
    for (const [cy, cx] of [[3, 3], [3, size - 4], [size - 4, 3]] as const) {
      assert.equal(m[cy][cx], true, "centre dark");
      assert.equal(m[cy - 1][cx - 1], true, "3×3 block dark");
      assert.equal(m[cy - 2][cx - 2], false, "light ring");
      assert.equal(m[cy - 3][cx - 3], true, "dark border");
    }
  });

  it("grows the version with the payload length", () => {
    const small = generateMatrix("x");
    const big = generateMatrix("https://propchain.example/certificate/9001?owner=0x1111111111111111111111111111111111111111");
    assert.ok(big.length > small.length);
  });

  it("is deterministic", () => {
    assert.deepEqual(generateMatrix("verify-me"), generateMatrix("verify-me"));
  });

  it("toSvg emits a self-contained svg", () => {
    const svg = toSvg("https://propchain.example/certificate/9001");
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("<path"));
    assert.ok(svg.trim().endsWith("</svg>"));
  });

  it("throws when the payload exceeds capacity", () => {
    assert.throws(() => generateMatrix("a".repeat(200)));
  });
});

// ── qrcode round-trip (independent decoder) ──────────────────────────────────
// Proves the generated matrix is actually decodable the way a real scanner
// reads it: recover the mask from the format bits, rebuild the function-module
// map from the version, unmask, read codewords in zig-zag order, de-interleave
// the blocks, and parse byte mode back to the original text. If any of mask,
// format info, placement, interleaving or encoding were wrong, this fails.
const QR_M = {
  1: { dataCW: 16, ecPerBlock: 10, numBlocks: 1, align: 0 },
  2: { dataCW: 28, ecPerBlock: 16, numBlocks: 1, align: 18 },
  3: { dataCW: 44, ecPerBlock: 26, numBlocks: 1, align: 22 },
  4: { dataCW: 64, ecPerBlock: 18, numBlocks: 2, align: 26 },
  5: { dataCW: 86, ecPerBlock: 24, numBlocks: 2, align: 30 },
  6: { dataCW: 108, ecPerBlock: 16, numBlocks: 4, align: 34 },
} as const;

function decodeQr(m: boolean[][]): { text: string; mask: number; ecBits: number } {
  const size = m.length;
  const version = (size - 17) / 4;
  const info = QR_M[version as 1 | 2 | 3 | 4 | 5 | 6];

  // Rebuild the function-module map structurally from the version.
  const isFn: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const mark = (x: number, y: number) => {
    if (x >= 0 && x < size && y >= 0 && y < size) isFn[y][x] = true;
  };
  for (let i = 0; i < size; i++) { mark(6, i); mark(i, 6); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]] as const) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) mark(cx + dx, cy + dy);
  }
  if (version >= 2) {
    const c = info.align;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) mark(c + dx, c + dy);
  }
  for (let i = 0; i <= 5; i++) mark(8, i);
  mark(8, 7); mark(8, 8); mark(7, 8);
  for (let i = 9; i < 15; i++) mark(14 - i, 8);
  for (let i = 0; i < 8; i++) mark(size - 1 - i, 8);
  for (let i = 8; i < 15; i++) mark(8, size - 15 + i);
  mark(8, size - 8);

  // Recover format info → mask + EC level.
  const fmtPos: [number, number][] = [];
  for (let i = 0; i <= 5; i++) fmtPos.push([8, i]);
  fmtPos.push([8, 7], [8, 8], [7, 8]);
  for (let i = 9; i < 15; i++) fmtPos.push([14 - i, 8]);
  let fmt = 0;
  fmtPos.forEach(([x, y], i) => { if (m[y][x]) fmt |= 1 << i; });
  const data5 = (fmt ^ 0x5412) >> 10;
  const mask = data5 & 7;
  const ecBits = (data5 >> 3) & 3;

  // Read codeword bits in zig-zag order, unmasking (mask 0 = (x+y) even).
  const bits: number[] = [];
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const up = ((right + 1) & 2) === 0;
        const y = up ? size - 1 - vert : vert;
        if (isFn[y][x]) continue;
        let bit = m[y][x] ? 1 : 0;
        if (mask === 0 && (x + y) % 2 === 0) bit ^= 1;
        bits.push(bit);
      }
    }
  }
  const codewords: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
    codewords.push(v);
  }

  // De-interleave the data codewords (equal-sized blocks).
  const perBlock = info.dataCW / info.numBlocks;
  const dataBytes = new Array<number>(info.dataCW);
  for (let c = 0; c < perBlock; c++) {
    for (let b = 0; b < info.numBlocks; b++) {
      dataBytes[b * perBlock + c] = codewords[c * info.numBlocks + b];
    }
  }

  // Parse byte mode: mode(4) | count(8) | bytes.
  const dbits: number[] = [];
  for (const byte of dataBytes) for (let k = 7; k >= 0; k--) dbits.push((byte >> k) & 1);
  let p = 0;
  const read = (n: number) => { let v = 0; for (let i = 0; i < n; i++) v = (v << 1) | dbits[p++]; return v; };
  const mode = read(4);
  if (mode !== 0b0100) throw new Error(`unexpected mode ${mode}`);
  const count = read(8);
  const out = new Uint8Array(count);
  for (let i = 0; i < count; i++) out[i] = read(8);
  return { text: new TextDecoder().decode(out), mask, ecBits };
}

describe("qrcode round-trip", () => {
  const payloads = [
    "PROP",
    "https://propchain.example/certificate/9001",
    "https://propchain-demo.vercel.app/certificate/9001",
    "https://propchain-demo.vercel.app/certificate/9001?owner=0x1111111111111111111111111111111111111111",
  ];
  for (const text of payloads) {
    it(`decodes back "${text.slice(0, 28)}${text.length > 28 ? "…" : ""}"`, () => {
      const decoded = decodeQr(generateMatrix(text));
      assert.equal(decoded.text, text, "payload round-trips");
      assert.equal(decoded.mask, 0, "format info encodes mask 0");
      assert.equal(decoded.ecBits, 0, "format info encodes EC level M");
    });
  }

  it("covers single-block and multi-block versions", () => {
    assert.equal(generateMatrix("PROP").length, 21); // v1, 1 block
    assert.ok(generateMatrix(payloads[3]).length >= 33); // v4+, multi-block
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
