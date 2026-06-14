"use client";

import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, Lock, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Lien { lender: string; amount: number; reason: string; }
interface Disp { reason: string; raisedBy: string; }

export default function ProtectionsCard({ tokenId, ulpin }: { tokenId: number | null; ulpin: string }) {
  const { toast } = useToast();
  const [encumbrance, setEncumbrance] = useState<Lien | null>(null);
  const [dispute, setDispute] = useState<Disp | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (tokenId == null) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/properties/${tokenId}/protections`)
      .then((r) => (r.ok ? r.json() : { encumbrance: null, dispute: null }))
      .then((d) => { setEncumbrance(d.encumbrance ?? null); setDispute(d.dispute ?? null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  if (tokenId == null) return null;

  const raiseDispute = async () => {
    if (reason.trim().length < 3) {
      toast({ title: "Add a reason", description: "Describe the dispute (min 3 chars).", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "raise", tokenId, ulpin, reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to raise dispute");
      toast({ title: "Dispute raised", description: "The property is now flagged for review." });
      setReason(""); setShowForm(false); load();
    } catch (err) {
      toast({ title: "Could not raise dispute", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Protections &amp; Disputes</h3>
          <p className="text-xs text-on_surface_variant dark:text-muted-foreground">Liens and ownership disputes</p>
        </div>
      </div>

      {loading ? (
        <div className="h-12 bg-stone/10 dark:bg-white/5 rounded-xl animate-pulse" />
      ) : (
        <div className="space-y-3">
          {/* Encumbrance */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface_container/50 dark:bg-white/5">
            <Lock size={16} className={encumbrance ? "text-error mt-0.5" : "text-success mt-0.5"} />
            <div className="min-w-0">
              {encumbrance ? (
                <>
                  <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">Active lien</p>
                  <p className="text-xs text-on_surface_variant dark:text-muted-foreground">
                    ₹{encumbrance.amount.toLocaleString("en-IN")} — {encumbrance.reason || "mortgage"}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-on_surface_variant dark:text-muted-foreground">No active encumbrance</p>
              )}
            </div>
          </div>

          {/* Dispute */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface_container/50 dark:bg-white/5">
            <Flag size={16} className={dispute ? "text-error mt-0.5" : "text-success mt-0.5"} />
            <div className="min-w-0">
              {dispute ? (
                <>
                  <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">Open dispute</p>
                  <p className="text-xs text-on_surface_variant dark:text-muted-foreground">{dispute.reason}</p>
                </>
              ) : (
                <p className="text-sm font-medium text-on_surface_variant dark:text-muted-foreground">No open disputes</p>
              )}
            </div>
          </div>

          {!dispute && (
            showForm ? (
              <div className="space-y-2 pt-1">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for dispute (e.g. competing ownership claim)…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0]"
                />
                <div className="flex gap-2">
                  <Button onClick={raiseDispute} disabled={busy} size="sm" variant="destructive" className="rounded-xl">
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit dispute"}
                  </Button>
                  <Button onClick={() => setShowForm(false)} disabled={busy} size="sm" variant="ghost" className="rounded-xl">Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="w-full rounded-xl mt-1">
                <Flag className="w-3.5 h-3.5 mr-1.5" /> Raise a dispute
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
