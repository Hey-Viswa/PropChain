"use client";

import { useCallback, useEffect, useState } from "react";
import { Users2, Loader2, Plus, X } from "lucide-react";
import { isAddress } from "viem";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Nominee { name: string; wallet: string; relation: string; sharePct: number; }
interface Nomination { nominees: Nominee[]; note: string; owner: string; }

interface Props {
  tokenId: number | null;
  ulpin: string;
  ownerWallet: string;
}

const emptyRow = (): Nominee => ({ name: "", wallet: "", relation: "", sharePct: 100 });

/**
 * Phase 3 — inheritance / succession planning. The owner nominates heirs (with
 * a share split that must total 100%); a registrar (ORACLE) later executes the
 * succession, reassigning ownership. Mirrors a multi-party probate flow.
 */
export default function SuccessionCard({ tokenId, ulpin, ownerWallet }: Props) {
  const { address } = useWallet();
  const { toast } = useToast();
  const [data, setData] = useState<Nomination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Nominee[]>([emptyRow()]);

  const isOwner = !!address && address.toLowerCase() === ownerWallet?.toLowerCase();

  const load = useCallback(() => {
    if (tokenId == null) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/succession?tokenId=${tokenId}`)
      .then((r) => (r.ok ? r.json() : { nomination: null }))
      .then((d) => setData(d.nomination ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  if (tokenId == null) return null;

  const setRow = (i: number, patch: Partial<Nominee>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const total = rows.reduce((s, r) => s + (Number(r.sharePct) || 0), 0);

  const submit = async () => {
    for (const r of rows) {
      if (r.name.trim().length < 2 || r.relation.trim().length < 2) {
        toast({ title: "Incomplete nominee", description: "Each heir needs a name and relation.", variant: "destructive" });
        return;
      }
      if (!isAddress(r.wallet)) {
        toast({ title: "Invalid wallet", description: `Check the wallet for ${r.name || "an heir"}.`, variant: "destructive" });
        return;
      }
    }
    if (total !== 100) {
      toast({ title: "Shares must total 100%", description: `Currently ${total}%.`, variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/succession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "nominate",
          tokenId,
          ulpin,
          nominees: rows.map((r) => ({ ...r, sharePct: Number(r.sharePct) })),
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error ?? "Failed to register heirs");
      toast({ title: "Heirs registered", description: "Succession nomination saved." });
      setShowForm(false); setRows([emptyRow()]); load();
    } catch (err) {
      toast({ title: "Could not register heirs", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/succession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke", tokenId, ulpin }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error ?? "Failed to revoke");
      toast({ title: "Nomination revoked" });
      load();
    } catch (err) {
      toast({ title: "Could not revoke", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <Users2 size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Succession Plan</h3>
          <p className="text-xs text-on_surface_variant dark:text-muted-foreground">Nominated heirs &amp; inheritance</p>
        </div>
      </div>

      {loading ? (
        <div className="h-12 bg-stone/10 dark:bg-white/5 rounded-xl animate-pulse" />
      ) : data ? (
        <div className="space-y-2">
          {data.nominees.map((n, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface_container/50 dark:bg-white/5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] truncate">{n.name} <span className="text-xs font-normal text-on_surface_variant">· {n.relation}</span></p>
                <p className="text-[11px] font-mono text-primary/70 truncate">{n.wallet}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-secondary">{n.sharePct}%</span>
            </div>
          ))}
          {isOwner && (
            <Button onClick={revoke} disabled={busy} variant="ghost" size="sm" className="w-full rounded-xl text-error">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Revoke nomination"}
            </Button>
          )}
        </div>
      ) : !isOwner ? (
        <p className="text-sm font-medium text-on_surface_variant dark:text-muted-foreground">No succession plan registered.</p>
      ) : showForm ? (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="space-y-2 p-3 rounded-xl bg-surface_container/40 dark:bg-white/5 relative">
              {rows.length > 1 && (
                <button onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-on_surface_variant/50 hover:text-error">
                  <X size={14} />
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input value={r.name} onChange={(e) => setRow(i, { name: e.target.value })} placeholder="Heir name"
                  className="h-10 px-3 rounded-lg bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0]" />
                <input value={r.relation} onChange={(e) => setRow(i, { relation: e.target.value })} placeholder="Relation (e.g. Son)"
                  className="h-10 px-3 rounded-lg bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0]" />
              </div>
              <input value={r.wallet} onChange={(e) => setRow(i, { wallet: e.target.value })} placeholder="Heir wallet (0x…)"
                className="w-full h-10 px-3 rounded-lg bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm font-mono text-on_surface dark:text-[#e8eaf0]" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-on_surface_variant">Share %</span>
                <input value={r.sharePct} onChange={(e) => setRow(i, { sharePct: Number(e.target.value) })} inputMode="numeric"
                  className="w-20 h-9 px-3 rounded-lg bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0]" />
              </div>
            </div>
          ))}
          {rows.length < 6 && (
            <Button onClick={() => setRows((rs) => [...rs, emptyRow()])} variant="ghost" size="sm" className="rounded-xl">
              <Plus size={14} className="mr-1" /> Add heir
            </Button>
          )}
          <p className={total === 100 ? "text-xs text-success" : "text-xs text-error"}>Total: {total}% {total === 100 ? "✓" : "(must be 100%)"}</p>
          <div className="flex gap-2">
            <Button onClick={submit} disabled={busy} size="sm" className="rounded-xl">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Register heirs"}
            </Button>
            <Button onClick={() => setShowForm(false)} disabled={busy} size="sm" variant="ghost" className="rounded-xl">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="w-full rounded-xl">
          <Users2 className="w-3.5 h-3.5 mr-1.5" /> Plan succession
        </Button>
      )}
    </div>
  );
}
