"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { isAddress } from "viem";
import { useWallet } from "@/hooks/useWallet";
import { usePropertyContract } from "@/hooks/usePropertyContract";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface TransferCardProps {
  tokenId: number | null;
  ownerWallet: string;
  statusUi: "verified" | "awaiting_oracle" | "rejected";
  onDone?: () => void;
}

/**
 * Owner-only transfer action for an approved property. Shown only when the
 * connected wallet owns the (verified, minted) property.
 */
export default function TransferCard({ tokenId, ownerWallet, statusUi, onDone }: TransferCardProps) {
  const { address } = useWallet();
  const { transferProperty } = usePropertyContract();
  const { toast } = useToast();
  const [buyer, setBuyer] = useState("");
  const [busy, setBusy] = useState(false);

  const isOwner = !!address && address.toLowerCase() === ownerWallet?.toLowerCase();
  if (tokenId == null || statusUi !== "verified" || !isOwner) return null;

  const handleTransfer = async () => {
    if (!isAddress(buyer)) {
      toast({ title: "Invalid address", description: "Enter a valid buyer wallet.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const hash = await transferProperty(tokenId, buyer);
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, toWallet: buyer, txHash: hash }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.reason ?? data.error ?? "Transfer sync failed");
      }
      toast({ title: "Transfer complete", description: `Token #${tokenId} sent to ${buyer.slice(0, 6)}…${buyer.slice(-4)}.` });
      setBuyer("");
      onDone?.();
    } catch (err) {
      toast({
        title: "Transfer failed",
        description: (err as Error).message ?? "The on-chain transfer did not complete.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Send size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Transfer Ownership</h3>
          <p className="text-xs text-on_surface_variant dark:text-muted-foreground">Send this property NFT to another wallet</p>
        </div>
      </div>

      <input
        value={buyer}
        onChange={(e) => setBuyer(e.target.value)}
        placeholder="Buyer wallet address (0x…)"
        className="w-full h-11 px-4 rounded-xl bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm font-mono text-on_surface dark:text-[#e8eaf0] mb-3"
      />
      <Button onClick={handleTransfer} disabled={busy || !buyer} className="w-full rounded-xl">
        {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Transferring…</>) : "Sign & Transfer"}
      </Button>
      <p className="text-[11px] text-on_surface_variant/70 dark:text-muted-foreground/70 mt-3 leading-relaxed">
        The buyer must be KYC-verified on-chain and the property must have no active encumbrance.
      </p>
    </div>
  );
}
