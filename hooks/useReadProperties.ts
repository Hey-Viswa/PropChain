"use client";
import { useReadContract } from "wagmi";
import { useWallet } from "./useWallet";
import { PROPERTY_NFT_ABI, PROPERTY_NFT_ADDRESS } from "@/lib/contracts/PropertyNFT.abi";
import { useEffect, useState } from "react";

interface OnChainProperty {
  tokenId:         number;
  ulpin:           string;
  physicalAddress: string;
  areaSqFt:        number;
  registeredAt:    number;
  isApproved:      boolean;
  hasEncumbrance:  boolean;
  registeredBy:    string;
  ipfsDocHash:     string;
  propertyType?:   string;
}

export function useReadProperties() {
  const { address, isConnected } = useWallet();
  const [properties, setProperties] = useState<OnChainProperty[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: tokenIds, refetch } = useReadContract({
    address: PROPERTY_NFT_ADDRESS as `0x${string}`,
    abi: PROPERTY_NFT_ABI,
    functionName: "getOwnerTokens",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address && isConnected },
  });

  useEffect(() => {
    if (!tokenIds || !Array.isArray(tokenIds)) return;
    fetchAllProperties(tokenIds as bigint[]);
  }, [tokenIds]);

  const fetchAllProperties = async (ids: bigint[]) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          // Read each property from contract
          const prop = await fetch(
            `/api/properties/token/${id.toString()}`
          ).then(r => r.json());
          return { ...prop, tokenId: Number(id) };
        })
      );
      setProperties(results.filter(Boolean));
    } catch (err) {
      console.error("Fetch properties error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, refetch };
}