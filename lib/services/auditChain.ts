/**
 * lib/services/auditChain.ts
 *
 * Phase 3 — tamper-evident, hash-chained audit log.
 *
 * Each entry's hash is computed over its contents AND the previous entry's
 * hash, so any retroactive edit to an earlier entry invalidates every hash
 * after it. This gives a tamper-evident trail without paying for on-chain
 * storage. Pure functions only — no I/O, fully unit-testable.
 *
 * Uses Node's built-in crypto (free, no external service).
 */
import { createHash } from "node:crypto";

export interface AuditEntryInput {
  action: string;
  actor: string;
  tokenId: number | string;
  data?: Record<string, unknown>;
  timestamp: number; // epoch milliseconds
}

export interface AuditEntry extends AuditEntryInput {
  index: number;
  prevHash: string;
  hash: string;
}

export const GENESIS_PREV_HASH = "0".repeat(64);

/** Deterministic SHA-256 over the canonical entry payload (excluding `hash`). */
export function computeEntryHash(entry: Omit<AuditEntry, "hash">): string {
  const payload = JSON.stringify({
    index: entry.index,
    action: entry.action,
    actor: entry.actor,
    tokenId: String(entry.tokenId),
    data: entry.data ?? {},
    timestamp: entry.timestamp,
    prevHash: entry.prevHash,
  });
  return createHash("sha256").update(payload).digest("hex");
}

/** Append an entry to an existing chain, linking it to the prior hash. */
export function appendEntry(
  chain: AuditEntry[],
  input: AuditEntryInput
): AuditEntry {
  const index = chain.length;
  const prevHash = index === 0 ? GENESIS_PREV_HASH : chain[index - 1].hash;
  const base = { ...input, index, prevHash };
  return { ...base, hash: computeEntryHash(base) };
}

/** Build a full chain from a list of inputs in order. */
export function buildChain(inputs: AuditEntryInput[]): AuditEntry[] {
  const chain: AuditEntry[] = [];
  for (const input of inputs) chain.push(appendEntry(chain, input));
  return chain;
}

export interface VerifyResult {
  valid: boolean;
  brokenAt: number | null; // index of first invalid entry, or null
  reason?: string;
}

/** Verify ordering, linkage, and per-entry hashes. Detects any tampering. */
export function verifyChain(chain: AuditEntry[]): VerifyResult {
  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];

    if (entry.index !== i) {
      return { valid: false, brokenAt: i, reason: "index out of order" };
    }

    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].hash;
    if (entry.prevHash !== expectedPrev) {
      return { valid: false, brokenAt: i, reason: "prevHash linkage broken" };
    }

    const recomputed = computeEntryHash({
      index: entry.index,
      action: entry.action,
      actor: entry.actor,
      tokenId: entry.tokenId,
      data: entry.data,
      timestamp: entry.timestamp,
      prevHash: entry.prevHash,
    });
    if (recomputed !== entry.hash) {
      return { valid: false, brokenAt: i, reason: "entry hash mismatch (tampered)" };
    }
  }
  return { valid: true, brokenAt: null };
}
