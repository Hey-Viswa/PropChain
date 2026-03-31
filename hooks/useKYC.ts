"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/hooks/useWallet";

interface KYCState {
  kycVerified:  boolean;
  verifiedAt:   string | null;
  aadhaarLast4: string | null;
  isLoading:    boolean;
  refetch:      () => void;
}

export function useKYC(): KYCState {
  const { user, isLoaded } = useUser();
  const { address }        = useWallet();

  const [kycVerified, setKycVerified]   = useState(false);
  const [verifiedAt, setVerifiedAt]     = useState<string | null>(null);
  const [aadhaarLast4, setAadhaarLast4] = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(true);

  const fetchKYC = useCallback(async () => {
    if (!isLoaded || !user) {
      setIsLoading(false);
      return;
    }
    try {
      const res  = await fetch("/api/kyc/status");
      const data = await res.json();
      setKycVerified(data.verified ?? false);
      setVerifiedAt(data.verifiedAt ?? null);
      setAadhaarLast4(data.aadhaarLast4 ?? null);
    } catch {
      setKycVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    fetchKYC();
  }, [fetchKYC]);

  return {
    kycVerified,
    verifiedAt,
    aadhaarLast4,
    isLoading,
    refetch: fetchKYC,
  };
}