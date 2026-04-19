import { createPublicClient, http, keccak256, toBytes } from "viem";
import { polygonMumbai, hardhat } from "viem/chains";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";

const chain = process.env.NODE_ENV === "production" ? polygonMumbai : hardhat;

const rpcUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MUMBAI_RPC_URL
    : "http://127.0.0.1:8545";

export const publicClient = createPublicClient({
  chain,
  transport: http(rpcUrl),
});

export async function verifyOracleRole(walletAddress: string): Promise<boolean> {
  try {
    const ORACLE_ROLE = keccak256(toBytes("ORACLE_ROLE"));

    const hasRole = await publicClient.readContract({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "hasRole",
      args: [ORACLE_ROLE, walletAddress as `0x${string}`],
    });

    return !!hasRole;
  } catch (err) {
    console.error("Oracle role verification failed:", err);
    return false;
  }
}
