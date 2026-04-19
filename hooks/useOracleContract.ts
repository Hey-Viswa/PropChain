"use client";
import { useWriteContract } from "wagmi";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";

export function useOracleContract() {
  const { writeContractAsync } = useWriteContract();

  const approveOnChain = async (tokenId: number) => {
    return await writeContractAsync({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "approveProperty",
      args: [BigInt(tokenId)],
    });
  };

  const rejectOnChain = async (tokenId: number, reason: string) => {
    return await writeContractAsync({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "rejectProperty",
      args: [BigInt(tokenId), reason],
    });
  };

  return { approveOnChain, rejectOnChain };
}