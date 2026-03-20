"use client";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";

export function usePropertyContract() {
  const { writeContractAsync } = useWriteContract();

  const mintProperty = async (
    ulpin: string,
    docHash: string,
    physicalAddress: string,
    areaSqFt: number
  ) => {
    const hash = await writeContractAsync({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "mintProperty",
      args: [ulpin, docHash, physicalAddress, BigInt(areaSqFt)],
    });
    return hash;
  };

  const transferProperty = async (tokenId: number, toAddress: string) => {
    const hash = await writeContractAsync({
      address: PROPERTY_NFT_ADDRESS as `0x${string}`,
      abi: PROPERTY_NFT_ABI,
      functionName: "transferProperty",
      args: [BigInt(tokenId), toAddress as `0x${string}`],
    });
    return hash;
  };

  return { mintProperty, transferProperty };
}