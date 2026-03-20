"use client";
import { useReadContract } from "wagmi";
import { useWallet } from "./useWallet";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";
import { keccak256, toBytes } from "viem";

export function useIsOracle() {
  const { address } = useWallet();
  const ORACLE_ROLE = keccak256(toBytes("ORACLE_ROLE"));

  const { data: isOracle, isLoading } = useReadContract({
    address: PROPERTY_NFT_ADDRESS as `0x${string}`,
    abi: PROPERTY_NFT_ABI,
    functionName: "hasRole",
    args: [ORACLE_ROLE, address as `0x${string}`],
    query: { enabled: !!address },
  });

  return { isOracle: !!isOracle, isLoading };
}
