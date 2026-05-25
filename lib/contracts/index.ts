import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat, polygonMumbai } from "viem/chains";
import { PROPERTY_NFT_ABI } from "./PropertyNFT.abi";

// Re-export the ABI so consumers only import from this file
export { PROPERTY_NFT_ABI as PropertyNFT_ABI };

// Contract address — set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ""
) as `0x${string}`;

// Resolve the active chain from the RPC URL env var
function resolveChain() {
  const rpc = process.env.BLOCKCHAIN_RPC_URL ?? "";
  if (rpc.includes("mumbai") || rpc.includes("polygon")) return polygonMumbai;
  return hardhat; // default to local hardhat node
}

/**
 * Returns a viem public client for read-only on-chain calls.
 * Uses BLOCKCHAIN_RPC_URL when set, falls back to localhost:8545.
 */
export function getProvider() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
  return createPublicClient({
    chain: resolveChain(),
    transport: http(rpcUrl),
  });
}

/**
 * Returns a viem wallet client for write transactions (server-side only).
 * Requires BLOCKCHAIN_RPC_URL to be set.
 */
export function getWalletClient() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
  return createWalletClient({
    chain: resolveChain(),
    transport: http(rpcUrl),
  });
}
