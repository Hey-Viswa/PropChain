"use client";

import { useCallback, useEffect, useState } from "react";
import { PieChart, Loader2, Coins } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Fractional {
  totalShares: number;
  shareSymbol: string;
  shareName: string;
  vaultAddress: string | null;
  owner: string;
}

interface Props {
  tokenId: number | null;
  ulpin: string;
  ownerWallet: string;
  statusUi: "verified" | "awaiting_oracle" | "rejected";
}

/**
 * Phase 3 — fractional (REIT-style) ownership panel. Mirrors the on-chain
 * FractionalOwnership vault: the owner can split an approved property into
 * tradeable ERC-20 shares, and redeem them to reassemble the NFT.
 */
export default function FractionalCard({ tokenId, ulpin, ownerWallet, statusUi }: Props) {
  const { address } = useWallet();
  const { toast } = useToast();
  const [data, setData] = useState<Fractional | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shares, setShares] = useState("1000");
  const [symbol, setSymbol] = useState("");

  const isOwner = !!address && address.toLowerCase() === ownerWallet?.toLowerCase();

  const load = useCallback(() => {
    if (tokenId == null) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/fractional?tokenId=${tokenId}`)
      .then((r) => (r.ok ? r.json() : { fractionalization: null }))
      .then((d) => setData(d.fractionalization ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  if (tokenId == null) return null;

  const fractionalize = async () => {
    const n = Number(shares);
    if (!Number.isInteger(n) || n < 1) {
      toast({ title: "Invalid shares", description: "Enter a whole number of shares.", variant: "destructive" });
      return;
    }
    if (!/^[A-Za-z0-9]{2,8}$/.test(symbol)) {
      toast({ title: "Invalid symbol", description: "2–8 letters/numbers, e.g. PROP1.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/fractional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "fractionalize",
          tokenId,
          ulpin,
          totalShares: n,
          shareName: `PropChain ${ulpin} Shares`,
          shareSymbol: symbol.toUpperCase(),
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error ?? "Failed to fractionalize");
      toast({ title: "Property fractionalized", description: `${n.toLocaleString("en-IN")} ${symbol.toUpperCase()} shares issued.` });
      setShowForm(false); setSymbol(""); load();
    } catch (err) {
      toast({ title: "Could not fractionalize", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const redeem = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/fractional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem", tokenId, ulpin }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error ?? "Failed to redeem");
      toast({ title: "Shares redeemed", description: "The property NFT has been reassembled." });
      load();
    } catch (err) {
      toast({ title: "Could not redeem", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <PieChart size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Fractional Ownership</h3>
          <p className="text-xs text-on_surface_variant dark:text-muted-foreground">REIT-style tradeable shares</p>
        </div>
      </div>

      {loading ? (
        <div className="h-12 bg-stone/10 dark:bg-white/5 rounded-xl animate-pulse" />
      ) : data ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface_container/50 dark:bg-white/5">
            <Coins size={16} className="text-primary mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">
                {data.totalShares.toLocaleString("en-IN")} {data.shareSymbol} shares
              </p>
              <p className="text-xs text-on_surface_variant dark:text-muted-foreground">
                {data.shareName} — each share is a fraction of this property
              </p>
            </div>
          </div>
          {isOwner && (
            <Button onClick={redeem} disabled={busy} variant="outline" size="sm" className="w-full rounded-xl">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Redeem all shares → reclaim NFT"}
            </Button>
          )}
        </div>
      ) : !isOwner || statusUi !== "verified" ? (
        <p className="text-sm font-medium text-on_surface_variant dark:text-muted-foreground">
          This property has not been fractionalized.
        </p>
      ) : showForm ? (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on_surface_variant/60">Total shares</label>
          <input
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            inputMode="numeric"
            className="w-full h-11 px-4 rounded-xl bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0]"
          />
          <label className="text-xs font-bold uppercase tracking-widest text-on_surface_variant/60">Share symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g. PROP1"
            maxLength={8}
            className="w-full h-11 px-4 rounded-xl bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm font-mono uppercase text-on_surface dark:text-[#e8eaf0]"
          />
          <div className="flex gap-2 pt-1">
            <Button onClick={fractionalize} disabled={busy} size="sm" className="rounded-xl">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Issue shares"}
            </Button>
            <Button onClick={() => setShowForm(false)} disabled={busy} size="sm" variant="ghost" className="rounded-xl">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="w-full rounded-xl">
          <PieChart className="w-3.5 h-3.5 mr-1.5" /> Fractionalize this property
        </Button>
      )}
    </div>
  );
}
