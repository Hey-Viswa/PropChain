/**
 * lib/services/credentialService.ts
 *
 * Phase 3 — W3C Verifiable Credential (simulation) for property ownership.
 *
 * Issues a credential that follows the W3C VC data model and seals it with an
 * HMAC-SHA256 proof over a canonical (sorted-key) serialization. Because the
 * proof depends on a server secret, a credential cannot be forged or altered
 * without it — `verifyCredential` recomputes and compares. This is a PoC stand
 * in for a real Ed25519 / BBS+ data-integrity proof.
 *
 * Pure and isomorphic apart from the HMAC (node:crypto), so it is unit-tested
 * directly by scripts/test-unit.ts.
 */
import { createHmac } from "node:crypto";

export interface OwnershipCredentialInput {
  tokenId: number;
  ulpin: string;
  owner: string; // wallet address
  physicalAddress: string;
  areaSqFt: number;
  propertyType: string;
  status: string;
  registeredAt?: string | null;
  chainId?: number;
  issuedAt?: string; // ISO; defaults to now (injectable for deterministic tests)
}

export interface VerifiableCredential {
  "@context": string[];
  type: string[];
  id: string;
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    ulpin: string;
    tokenId: number;
    physicalAddress: string;
    areaSqFt: number;
    propertyType: string;
    status: string;
    registeredAt: string | null;
  };
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

const ISSUER_DID = "did:propchain:registry";
const PROOF_TYPE = "PropChainHmacSha256Proof2024";

/** Stable, sorted-key JSON serialization for deterministic hashing. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(",")}}`;
}

function signingSecret(): string {
  return process.env.CREDENTIAL_SIGNING_SECRET || "propchain-dev-credential-secret";
}

/** Build the unsigned credential document. */
export function buildOwnershipCredential(input: OwnershipCredentialInput): VerifiableCredential {
  const issuedAt = input.issuedAt ?? new Date().toISOString();
  const chainId = input.chainId ?? 31337;
  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://propchain.example/credentials/v1",
    ],
    type: ["VerifiableCredential", "PropertyOwnershipCredential"],
    id: `urn:propchain:credential:${input.tokenId}:${issuedAt}`,
    issuer: ISSUER_DID,
    issuanceDate: issuedAt,
    credentialSubject: {
      id: `did:pkh:eip155:${chainId}:${input.owner}`,
      ulpin: input.ulpin,
      tokenId: input.tokenId,
      physicalAddress: input.physicalAddress,
      areaSqFt: input.areaSqFt,
      propertyType: input.propertyType,
      status: input.status,
      registeredAt: input.registeredAt ?? null,
    },
  };
}

function proofValue(vcWithoutProof: VerifiableCredential, created: string): string {
  const payload = canonicalize({ credential: vcWithoutProof, created });
  return createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

/** Attach a data-integrity proof, returning the signed credential. */
export function signCredential(vc: VerifiableCredential): VerifiableCredential {
  const created = vc.issuanceDate;
  const { proof: _omit, ...unsigned } = vc;
  void _omit;
  const value = proofValue(unsigned as VerifiableCredential, created);
  return {
    ...(unsigned as VerifiableCredential),
    proof: {
      type: PROOF_TYPE,
      created,
      verificationMethod: `${ISSUER_DID}#keys-1`,
      proofPurpose: "assertionMethod",
      proofValue: value,
    },
  };
}

/** Build + sign in one step. */
export function issueCredential(input: OwnershipCredentialInput): VerifiableCredential {
  return signCredential(buildOwnershipCredential(input));
}

/** Recompute the proof and confirm the credential has not been tampered with. */
export function verifyCredential(vc: VerifiableCredential): { valid: boolean; reason: string | null } {
  if (!vc.proof) return { valid: false, reason: "missing proof" };
  if (vc.proof.type !== PROOF_TYPE) return { valid: false, reason: "unsupported proof type" };
  const { proof, ...unsigned } = vc;
  const expected = proofValue(unsigned as VerifiableCredential, proof.created);
  if (expected !== proof.proofValue) return { valid: false, reason: "proof mismatch" };
  return { valid: true, reason: null };
}
