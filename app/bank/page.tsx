"use client";

import { useState } from "react";
import { Landmark, Loader2, Lock, Unlock, ShieldAlert } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ULPIN_RE = /^[A-Z]{2}\d{10}$/;

export default function BankDeskPage() {
  const { isBank, isOracle, isSuperAdmin, isLoading } = useAdminRole();
  const { toast } = useToast();

  const [tokenId, setTokenId] = useState("");
  const [ulpin, setUlpin] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"add" | "release" | null>(null);

  const allowed = isBank || isOracle || isSuperAdmin;

  const call = async (action: "add" | "release") => {
    const tid = Number(tokenId);
    if (!Number.isInteger(tid) || tid < 0) {
      toast({ title: "Invalid token id", variant: "destructive" });
      return;
    }
    if (!ULPIN_RE.test(ulpin.toUpperCase())) {
      toast({ title: "Invalid ULPIN", description: "Format: 2 letters + 10 digits.", variant: "destructive" });
      return;
    }
    if (action === "add" && !(Number(amount) > 0)) {
      toast({ title: "Enter a loan amount", variant: "destructive" });
      return;
    }
    setBusy(action);
    try {
      const res = await fetch("/api/encumbrance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          tokenId: tid,
          ulpin: ulpin.toUpperCase(),
          ...(action === "add" ? { amount: Number(amount), reason } : {}),
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error ?? "Request failed");
      toast({
        title: action === "add" ? "Lien registered" : "Lien released",
        description: `Token #${tid} (${ulpin.toUpperCase()}).`,
      });
      if (action === "release") { setAmount(""); setReason(""); }
    } catch (err) {
      toast({ title: "Could not complete", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
        <ShieldAlert className="w-10 h-10 text-error" />
        <p className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0]">Bank access required</p>
        <p className="text-body-md text-on_surface_variant dark:text-muted-foreground max-w-md">
          The Bank Desk is restricted to wallets with the BANK role. A SUPER_ADMIN can grant it from the dev admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Bank Desk</h1>
          <p className="text-body-md text-on_surface_variant dark:text-muted-foreground">
            Register and release mortgages (liens) against registered properties.
          </p>
        </div>
      </div>

      <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <LabeledInput label="Token ID" value={tokenId} onChange={setTokenId} placeholder="0" mono />
          <LabeledInput label="ULPIN" value={ulpin} onChange={(v) => setUlpin(v.toUpperCase())} placeholder="MH1234567890" mono />
        </div>
        <LabeledInput label="Loan / mortgage amount (₹)" value={amount} onChange={setAmount} placeholder="5000000" mono />
        <LabeledInput label="Reason / reference" value={reason} onChange={setReason} placeholder="Home loan #HL-2026-014" />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => call("add")} disabled={busy !== null} className="rounded-xl">
            {busy === "add" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            Register lien
          </Button>
          <Button onClick={() => call("release")} disabled={busy !== null} variant="outline" className="rounded-xl">
            {busy === "release" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Unlock className="w-4 h-4 mr-2" />}
            Release lien
          </Button>
        </div>
        <p className="text-[11px] text-on_surface_variant/70 dark:text-muted-foreground/70 leading-relaxed">
          A property with an active lien cannot be transferred until the lien is released. Actions are recorded in the
          audit log and mirror the on-chain EncumbranceRegistry.
        </p>
      </div>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, placeholder, mono,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-on_surface_variant/60 mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 px-4 rounded-xl bg-surface_container_highest dark:bg-white/5 border border-outline_variant/20 outline-none focus:border-primary text-sm text-on_surface dark:text-[#e8eaf0] ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
