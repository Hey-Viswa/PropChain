import { createPublicClient, createWalletClient, http, type Chain } from "viem";
import { hardhat, polygonAmoy, polygonMumbai } from "viem/chains";
import { PROPERTY_NFT_ABI } from "./PropertyNFT.abi";
import { ENCUMBRANCE_REGISTRY_ABI, ENCUMBRANCE_REGISTRY_ADDRESS } from "./EncumbranceRegistry.abi";
import { DISPUTE_REGISTRY_ABI, DISPUTE_REGISTRY_ADDRESS } from "./DisputeRegistry.abi";
import { FRACTIONAL_OWNERSHIP_ABI } from "./FractionalOwnership.abi";

// Re-export ABIs so consumers only import from this file
export { PROPERTY_NFT_ABI as PropertyNFT_ABI };
export {
  ENCUMBRANCE_REGISTRY_ABI,
  ENCUMBRANCE_REGISTRY_ADDRESS,
  DISPUTE_REGISTRY_ABI,
  DISPUTE_REGISTRY_ADDRESS,
  FRACTIONAL_OWNERSHIP_ABI,
};

// Core PropertyNFT contract address — set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ""
) as `0x${string}`;

/**
 * Resolve the active chain from the RPC URL / chain id env vars.
 * Polygon Amoy (80002) is the active free testnet — Mumbai was sunset in 2024
 * but is kept as a fallback for older configs.
 */
function resolveChain(): Chain {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 0);
  if (chainId === polygonAmoy.id) return polygonAmoy;
  if (chainId === polygonMumbai.id) return polygonMumbai;

  const rpc = (process.env.BLOCKCHAIN_RPC_URL ?? "").toLowerCase();
  if (rpc.includes("amoy")) return polygonAmoy;
  if (rpc.includes("mumbai")) return polygonMumbai;
  if (rpc.includes("polygon")) return polygonAmoy;
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
