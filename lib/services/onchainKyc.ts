/**
 * lib/services/onchainKyc.ts
 *
 * Grants on-chain KYC for a wallet so it can mint property NFTs.
 *
 * PropertyNFT.mintProperty() requires kycVerified[msg.sender] == true on-chain.
 * Mock KYC only writes to MongoDB, so after a successful mock KYC we also flip
 * the on-chain flag using the admin key (which holds KYC_ROLE).
 *
 * Best-effort: if the admin key / contract / RPC isn't configured (e.g. a pure
 * UI demo with no chain), this returns { ok:false, reason } and the caller keeps
 * the DB-level KYC. No paid service involved.
 */
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy, hardhat } from "viem/chains";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";

const chain = process.env.NODE_ENV === "production" ? polygonAmoy : hardhat;
const rpcUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BLOCKCHAIN_RPC_URL ?? process.env.AMOY_RPC_URL
    : "http://127.0.0.1:8545";

export async function grantOnchainKyc(
  wallet: string
): Promise<{ ok: boolean; txHash?: string; reason?: string }> {
  const rawKey = process.env.ADMIN_WALLET_PRIVATE_KEY;
  if (!rawKey) return { ok: false, reason: "ADMIN_WALLET_PRIVATE_KEY not set" };
  if (!PROPERTY_NFT_ADDRESS) return { ok: false, reason: "contract address not set" };
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return { ok: false, reason: "invalid wallet" };

  try {
    const key = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as `0x${string}`;
    const account = privateKeyToAccount(key);
    const walletClient = createWalletClient({ account, chain, transport: http(rpcUrl) });
    const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

    // Skip if already verified on-chain.
    try {
      const already = await publicClient.readContract({
        address: PROPERTY_NFT_ADDRESS as `0x${string}`,
        abi: PROPERTY_NFT_ABI,
        functionName: "kycVerified",
        args: [wallet as `0x${string}`],
      });
      if (already) return { ok: true };
    } catch {
      /* fall through to write */
    }

    const txHash = await walletClient.writeContract({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "verifyKYC",
      args: [wallet as `0x${string}`],
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 30_000 });
    return { ok: true, txHash };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}
