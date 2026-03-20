import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";

export function useKYC() {
  const { address, isConnected } = useWallet();
  const [kycVerified, setKycVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!address) return;
    checkKYCStatus();
  }, [address]);

  const checkKYCStatus = async () => {
    if (!address) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/kyc/status?wallet=${address}`);
      const data = await res.json();
      setKycVerified(data.kycVerified);
    } catch (err) {
      console.error("KYC check error:", err);
    } finally {
      setChecking(false);
    }
  };

  const submitKYC = async (aadhaarNumber: string) => {
    if (!address) return { success: false, error: "No wallet connected" };
    setLoading(true);
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, aadhaarNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setKycVerified(true);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  return { kycVerified, loading, checking, submitKYC, checkKYCStatus };
}