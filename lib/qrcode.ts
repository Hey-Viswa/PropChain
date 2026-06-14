/**
 * lib/qrcode.ts
 *
 * Minimal, dependency-free QR Code generator implemented from ISO/IEC 18004.
 * Scope is intentionally narrow — exactly what the ownership certificate needs:
 *   • byte (8-bit) mode
 *   • error-correction level M
 *   • versions 1–6 (21×21 … 41×41), auto-selected by length
 *   • a single fixed mask (pattern 0)
 *
 * Capacity is up to 106 bytes — plenty for a verification URL. Pure arithmetic,
 * so it runs identically in Node (tests) and the browser (certificate page).
 */

// ── GF(256) tables (primitive polynomial 0x11d) ──────────────────────────────
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

// ── Reed–Solomon ─────────────────────────────────────────────────────────────
function rsDivisor(degree: number): Uint8Array {
  const result = new Uint8Array(degree);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data: Uint8Array, divisor: Uint8Array): Uint8Array {
  const result = new Uint8Array(divisor.length);
  for (const b of data) {
    const factor = b ^ result[0];
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < result.length; i++) {
      result[i] ^= gfMul(divisor[i], factor);
    }
  }
  return result;
}

// ── Version table (ECC level M) ──────────────────────────────────────────────
interface VInfo {
  dataCW: number; // total data codewords
  ecPerBlock: number;
  numBlocks: number;
  align: number | null; // single alignment-pattern centre (v2–6)
}
const VERSIONS: Record<number, VInfo> = {
  1: { dataCW: 16, ecPerBlock: 10, numBlocks: 1, align: null },
  2: { dataCW: 28, ecPerBlock: 16, numBlocks: 1, align: 18 },
  3: { dataCW: 44, ecPerBlock: 26, numBlocks: 1, align: 22 },
  4: { dataCW: 64, ecPerBlock: 18, numBlocks: 2, align: 26 },
  5: { dataCW: 86, ecPerBlock: 24, numBlocks: 2, align: 30 },
  6: { dataCW: 108, ecPerBlock: 16, numBlocks: 4, align: 34 },
};
const MAX_VERSION = 6;

function pickVersion(byteLen: number): number {
  for (let v = 1; v <= MAX_VERSION; v++) {
    if (byteLen <= VERSIONS[v].dataCW - 2) return v;
  }
  throw new Error(`QR: payload too long (${byteLen} bytes, max ${VERSIONS[MAX_VERSION].dataCW - 2})`);
}

// ── Data encoding (byte mode) ────────────────────────────────────────────────
function encodeData(text: string, dataCW: number): Uint8Array {
  const bytes = new TextEncoder().encode(text);
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(0b0100, 4); // byte-mode indicator
  push(bytes.length, 8); // char count (8 bits for v1–9 byte mode)
  for (const b of bytes) push(b, 8);

  const capacityBits = dataCW * 8;
  push(0, Math.min(4, capacityBits - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.push(0); // byte align

  const pad = [0xec, 0x11];
  for (let p = 0; bits.length < capacityBits; p++) push(pad[p % 2], 8);

  const out = new Uint8Array(dataCW);
  for (let i = 0; i < dataCW; i++) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i * 8 + j];
    out[i] = v;
  }
  return out;
}

// Interleave data + EC codewords (all blocks equal-sized for v1–6/level M).
function buildCodewords(dataBytes: Uint8Array, v: VInfo): Uint8Array {
  const perBlock = v.dataCW / v.numBlocks;
  const gen = rsDivisor(v.ecPerBlock);
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  for (let b = 0; b < v.numBlocks; b++) {
    const blk = dataBytes.slice(b * perBlock, (b + 1) * perBlock);
    dataBlocks.push(blk);
    ecBlocks.push(rsRemainder(blk, gen));
  }
  const total = v.dataCW + v.numBlocks * v.ecPerBlock;
  const result = new Uint8Array(total);
  let k = 0;
  for (let c = 0; c < perBlock; c++) for (let b = 0; b < v.numBlocks; b++) result[k++] = dataBlocks[b][c];
  for (let c = 0; c < v.ecPerBlock; c++) for (let b = 0; b < v.numBlocks; b++) result[k++] = ecBlocks[b][c];
  return result;
}

// ── Matrix assembly ──────────────────────────────────────────────────────────
function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

/** Build the boolean module matrix (true = dark) for the given text. */
export function generateMatrix(text: string): boolean[][] {
  const version = pickVersion(new TextEncoder().encode(text).length);
  const vinfo = VERSIONS[version];
  const size = version * 4 + 17;

  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFn: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFn[y][x] = true;
  };

  // Timing patterns
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }

  // Finder patterns + separators
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const xx = cx + dx;
        const yy = cy + dy;
        if (xx < 0 || xx >= size || yy < 0 || yy >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);

  // Alignment pattern (single, v2–6)
  if (vinfo.align !== null) {
    const c = vinfo.align;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        set(c + dx, c + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  // Format information (EC level M = 0, fixed mask 0) — also reserves the area.
  const drawFormat = () => {
    const data = (0b00 << 3) | 0; // ecLevel M (00) | mask 0
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++) set(8, i, getBit(bits, i));
    set(8, 7, getBit(bits, 6));
    set(8, 8, getBit(bits, 7));
    set(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, getBit(bits, i));

    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, getBit(bits, i));
    set(8, size - 8, true); // dark module
  };
  drawFormat();

  // Place codewords (zig-zag), applying mask 0 to non-function modules.
  const dataBytes = encodeData(text, vinfo.dataCW);
  const codewords = buildCodewords(dataBytes, vinfo);
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // skip vertical timing column
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (isFn[y][x]) continue;
        let dark = false;
        if (bitIndex < codewords.length * 8) {
          dark = getBit(codewords[bitIndex >>> 3], 7 - (bitIndex & 7));
          bitIndex++;
        }
        // mask pattern 0: invert where (x + y) even
        if ((x + y) % 2 === 0) dark = !dark;
        modules[y][x] = dark;
      }
    }
  }

  return modules;
}

export interface QrSvgOptions {
  margin?: number; // quiet-zone modules (default 4)
  dark?: string;
  light?: string;
}

/** Render the QR for `text` as a self-contained, scalable SVG string. */
export function toSvg(text: string, opts: QrSvgOptions = {}): string {
  const m = generateMatrix(text);
  const size = m.length;
  const margin = opts.margin ?? 4;
  const dim = size + margin * 2;
  const dark = opts.dark ?? "#1a1a1a";
  const light = opts.light ?? "#ffffff";

  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (m[y][x]) path += `M${x + margin} ${y + margin}h1v1h-1z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" ` +
    `width="100%" height="100%" shape-rendering="crispEdges">` +
    `<rect width="${dim}" height="${dim}" fill="${light}"/>` +
    `<path d="${path}" fill="${dark}"/></svg>`
  );
}
