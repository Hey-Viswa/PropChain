"use client";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (isConnected) return;
    if (isConnecting) return;

    if (
      typeof window === "undefined" ||
      typeof (window as any).ethereum === "undefined"
    ) {
      toast({
        title: "MetaMask not found",
        description:
          "Please install MetaMask from metamask.io " +
          "and refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await connectAsync({ connector: metaMask() });
      toast({
        title: "Wallet connected",
        description:
          "Your wallet has been connected successfully.",
      });
    } catch (err: any) {
      if (err?.code === -32002) {
        toast({
          title: "Connection pending",
          description:
            "MetaMask has a pending request. " +
            "Please open MetaMask and approve or reject it.",
          variant: "destructive",
        });
        return;
      }
      if (err?.code === 4001) {
        toast({
          title: "Connection rejected",
          description: "You rejected the wallet connection.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Connection failed",
        description:
          err?.message ?? "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const isCorrectNetwork =
    chain?.id === 31337 || chain?.id === 80001;

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    truncatedAddress,
    isCorrectNetwork,
    chain,
  };
}
