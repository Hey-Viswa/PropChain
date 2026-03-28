"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

interface KYCStatus {
  verified:      boolean;
  submitted:     boolean;
  submittedAt?:  string;
  verifiedAt?:   string;
  walletAddress?: string;
  attempts?:     number;
}

interface UseKYCReturn {
  kycVerified:  boolean;
  kycSubmitted: boolean;
  kycStatus:    KYCStatus | null;
  loading:      boolean;
  error:        string | null;
  submit:       (data: { aadhaarLast4: string; walletAddress?: string }) => Promise<boolean>;
  refresh:      () => void;
}

export function useKYC(): UseKYCReturn {
  const { isSignedIn, isLoaded } = useUser();
  const [kycStatus, setKycStatus]   = useState<KYCStatus | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/kyc");
      if (!res.ok) throw new Error("Failed to fetch KYC status");
      const data: KYCStatus = await res.json();
      setKycStatus(data);
    } catch {
      setError("Could not load KYC status");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const submit = useCallback(
    async (data: { aadhaarLast4: string; walletAddress?: string }): Promise<boolean> => {
      setError(null);
      try {
        const res = await fetch("/api/user/kyc", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Submission failed");
          return false;
        }
        await fetchStatus();
        return true;
      } catch {
        setError("Submission failed. Please try again.");
        return false;
      }
    },
    [fetchStatus]
  );

  return {
    kycVerified:  kycStatus?.verified  ?? false,
    kycSubmitted: kycStatus?.submitted ?? false,
    kycStatus,
    loading,
    error,
    submit,
    refresh: fetchStatus,
  };
}
