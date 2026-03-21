"use client";
import { useWallet } from "@/hooks/useWallet";

export default function NetworkWarning() {
  const { isConnected, isCorrectNetwork } = useWallet();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="bg-error_container dark:bg-[#2d0a0a] text-on_error_container dark:text-[#f87171]
                    text-sm font-medium px-4 py-2.5 text-center
                    w-full">
      Wrong network. Please switch to Localhost (31337)
      or Mumbai in MetaMask.
    </div>
  );
}