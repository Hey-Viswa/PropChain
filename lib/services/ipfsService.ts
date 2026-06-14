/**
 * lib/services/ipfsService.ts
 *
 * Phase 2 — document/metadata pinning to IPFS via Pinata (free tier).
 *
 * Auth: set PINATA_JWT (Pinata dashboard -> API Keys -> JWT). Free tier covers
 * 1 GB / 500 pins, which is ample for a PoC.
 *
 * Graceful fallback: with no PINATA_JWT, pinning is *simulated* — a deterministic
 * pseudo-CID is derived from the content hash so the rest of the app keeps
 * working offline / in CI without a paid plan or network.
 */
import { createHash } from "node:crypto";

const PINATA_JWT = process.env.PINATA_JWT ?? "";
const PINATA_GATEWAY =
  process.env.PINATA_GATEWAY?.replace(/\/+$/, "") || "https://gateway.pinata.cloud";
const PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export interface PinResult {
  cid: string;
  url: string;
  simulated: boolean;
}

export function isIpfsConfigured(): boolean {
  return PINATA_JWT.length > 0;
}

/** Public gateway URL for a CID. */
export function gatewayUrl(cid: string): string {
  const clean = cid.replace(/^ipfs:\/\//, "");
  return `${PINATA_GATEWAY}/ipfs/${clean}`;
}

/** Deterministic stand-in CID used when Pinata is not configured. */
function simulatedCid(input: string | Buffer): string {
  const hash = createHash("sha256").update(input).digest("hex");
  // Not a real multihash — clearly namespaced so it can't be mistaken for one.
  return `sim-${hash.slice(0, 46)}`;
}

/** Pin a JSON object and return its CID. */
export async function pinJSON(
  data: unknown,
  name = "propchain-metadata"
): Promise<PinResult> {
  if (!isIpfsConfigured()) {
    const cid = simulatedCid(JSON.stringify(data));
    return { cid, url: gatewayUrl(cid), simulated: true };
  }

  const res = await fetch(PIN_JSON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: { name },
    }),
  });

  if (!res.ok) {
    throw new Error(`Pinata pinJSON failed: ${res.status} ${await safeText(res)}`);
  }
  const json = (await res.json()) as { IpfsHash: string };
  return { cid: json.IpfsHash, url: gatewayUrl(json.IpfsHash), simulated: false };
}

/** Pin a binary file (document) and return its CID. */
export async function pinFile(
  bytes: Buffer | Uint8Array,
  filename: string,
  contentType = "application/octet-stream"
): Promise<PinResult> {
  if (!isIpfsConfigured()) {
    const cid = simulatedCid(Buffer.from(bytes));
    return { cid, url: gatewayUrl(cid), simulated: true };
  }

  const form = new FormData();
  const blob = new Blob([Buffer.from(bytes)], { type: contentType });
  form.append("file", blob, filename);
  form.append("pinataMetadata", JSON.stringify({ name: filename }));

  const res = await fetch(PIN_FILE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Pinata pinFile failed: ${res.status} ${await safeText(res)}`);
  }
  const json = (await res.json()) as { IpfsHash: string };
  return { cid: json.IpfsHash, url: gatewayUrl(json.IpfsHash), simulated: false };
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
