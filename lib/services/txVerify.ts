/**
 * lib/services/txVerify.ts
 *
 * Best-effort on-chain transaction receipt verification for PoC sync routes.
 *
 * Returns:
 *   true  — receipt found and status === success
 *   false — receipt found but the tx reverted
 *   null  — could not verify (no RPC / timeout); caller decides how strict to be
 *
 * The Oracle approve route verifies receipts strictly; encumbrance/dispute use
 * this softer check so the PoC keeps working when the chain is unreachable.
 */
import { getProvider } from "@/lib/contracts";

export async function verifyTxReceipt(
  txHash: string,
  timeoutMs = 15_000
): Promise<boolean | null> {
  try {
    const client = getProvider();
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations: 1,
      timeout: timeoutMs,
    });
    return receipt.status === "success";
  } catch {
    return null;
  }
}
