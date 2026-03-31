"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";

type MintFlowState = "idle" | "awaiting_wallet" | "mining" | "success" | "error";

type MintPropertyInput = {
  recordId: string;
  ulpin: string;
  docHash: string;
  physicalAddress: string;
  areaSqFt: number;
};

type MintPropertyResult = {
  txHash: `0x${string}`;
  tokenId: number;
};

export function usePropertyContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const [mintState, setMintState] = useState<MintFlowState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const mintProperty = async ({
    recordId,
    ulpin,
    docHash,
    physicalAddress,
    areaSqFt,
  }: MintPropertyInput): Promise<MintPropertyResult> => {
    if (!address) {
      setMintState("awaiting_wallet");
      const message = "Connect your wallet before minting.";
      setError(message);
      throw new Error(message);
    }

    if (!publicClient) {
      setMintState("error");
      const message = "Web3 client unavailable.";
      setError(message);
      throw new Error(message);
    }

    setMintState("awaiting_wallet");
    setError(null);

    try {
      const hash = await writeContractAsync({
        address: PROPERTY_NFT_ADDRESS as `0x${string}`,
        abi: PROPERTY_NFT_ABI,
        functionName: "mintProperty",
        args: [ulpin, docHash, physicalAddress, BigInt(areaSqFt)],
      });

      setTxHash(hash);
      setMintState("mining");
      toast({
        title: "Transaction submitted",
        description: `Tx: ${hash.slice(0, 10)}...${hash.slice(-6)}`,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const transferLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === PROPERTY_NFT_ADDRESS.toLowerCase() &&
          log.topics?.[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );

      if (!transferLog || !transferLog.topics?.[3]) {
        throw new Error("Mint succeeded but tokenId could not be parsed from receipt.");
      }

      const tokenId = Number(BigInt(transferLog.topics[3]));

      const confirmRes = await fetch("/api/properties/confirm-mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          txHash: hash,
          tokenId,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData.error ?? "Failed to confirm mint in backend.");
      }

      setMintState("success");
      toast({
        title: "Mint confirmed",
        description: `Token #${tokenId} has been recorded.`,
      });
      return { txHash: hash, tokenId };
    } catch (err: any) {
      const message = err?.shortMessage ?? err?.message ?? "Mint failed";
      setMintState("error");
      setError(message);
      toast({
        title: "Mint failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
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

  return {
    mintProperty,
    transferProperty,
    mintState,
    mintError: error,
    txHash,
    resetMintState: () => {
      setMintState("idle");
      setError(null);
      setTxHash(null);
    },
  };
}
