"use client";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";

export default function NetworkWarning() {
  const { isConnected, isCorrectNetwork } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConnected || isCorrectNetwork) return null;

  return (
    <div className="bg-error_container text-on_error_container
                    text-sm font-medium px-4 py-2 text-center">
      Wrong network. Please switch to Localhost (31337) or Mumbai in MetaMask.
    </div>
  );
}