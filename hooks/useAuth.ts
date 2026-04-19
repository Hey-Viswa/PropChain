"use client";
import { useUser } from "@clerk/nextjs";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { address, isConnected, connect } = useWallet();
  const [walletLinked, setWalletLinked] = useState(false);
  const [linking, setLinking] = useState(false);

  // Auto-link wallet to Clerk user when both are available
  useEffect(() => {
    if (isSignedIn && isConnected && address) {
      linkWallet();
    }
  }, [isSignedIn, isConnected, address]);

  const linkWallet = async () => {
    if (!address) return;
    setLinking(true);
    try {
      const res = await fetch("/api/user/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await res.json();
      if (data.success) setWalletLinked(true);
    } catch (err) {
      console.error("Wallet link error:", err);
    } finally {
      setLinking(false);
    }
  };

  return {
    // Clerk state
    user,
    isLoaded,
    isSignedIn,
    clerkId: user?.id ?? null,
    email:   user?.primaryEmailAddress?.emailAddress ?? null,

    // Wallet state
    address,
    isConnected,
    connect,
    walletLinked,
    linking,

    // Combined
    isFullyAuthenticated: isSignedIn && isConnected,
  };
}