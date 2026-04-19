"use client";

import { Suspense, useEffect, useState } from "react";
import { 
  ListTodo, CheckSquare, XSquare, Clock, RefreshCw, 
  AlertTriangle, ShieldCheck, ChevronRight, FileText, Search
} from "lucide-react";
import OracleGuard from "@/components/shared/OracleGuard";
import { useOracleContract } from "@/hooks/useOracleContract";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PropertyItem = {
  _id: string;
  tokenId: number;
  physicalAddress: string;
  status: string;
  documentUrl: string;
};

export default function OracleQueuePage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { approveOnChain, rejectOnChain } = useOracleContract();
  const { toast } = useToast();

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/oracle/pending");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch {
      toast({ title: "Error fetching properties" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recordId: string, tokenId: number) => {
    try {
      toast({ title: "Approving in MetaMask…" });
      await approveOnChain(tokenId);
      toast({ title: "Transaction sent. Updating database…" });
      const res = await fetch("/api/oracle/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId }),
      });
      if (!res.ok) throw new Error("Failed to update db");
      setProperties((prev) => prev.filter((p) => p._id !== recordId));
      toast({ title: "Property approved" });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message });
    }
  };

  const handleReject = async (recordId: string, tokenId: number) => {
    if (!rejectReason.trim()) {
      toast({ title: "Please provide a rejection reason." });
      return;
    }
    try {
      toast({ title: "Rejecting in MetaMask…" });
      await rejectOnChain(tokenId, rejectReason);
      toast({ title: "Transaction sent. Updating database…" });
      const res = await fetch("/api/oracle/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, reason: rejectReason }),
      });
      if (!res.ok) throw new Error("Failed to update db");
      setProperties((prev) => prev.filter((p) => p._id !== recordId));
      setRejectingId(null);
      setRejectReason("");
      toast({ title: "Property rejected" });
    } catch (err: any) {
      toast({ title: "Rejection failed", description: err.message });
    }
  };

  return (
    <OracleGuard>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
              Verification Queue
            </h1>
            <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
              Institutional review of pending on-chain property registrations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPending}
            disabled={loading}
            className="h-10 px-5 font-bold uppercase tracking-widest text-[10px] bg-white dark:bg-[#1a1916] border-stone dark:border-[#2a2520]"
          >
            <RefreshCw className={cn("mr-2 h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh Queue
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatMini label="Pending" value={properties.length} accent="primary" />
          <StatMini label="Processing" value="0" accent="neutral" />
          <StatMini label="Finalized Today" value="0" accent="success" />
        </div>

        {/* Queue list */}
        <Card className="border-stone dark:border-[#2a2520] shadow-sm">
          <CardHeader className="pb-4 border-b border-stone/50 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-display">Active Submissions</CardTitle>
                <CardDescription>Verify legal documents and ULPIN validity</CardDescription>
              </div>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on_surface_variant/40" />
                <Input placeholder="Filter queue..." className="h-9 w-[200px] pl-9 text-xs rounded-xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-sand dark:bg-[#211f1c] animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-3xl bg-success/10 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on_surface dark:text-[#e8eaf0]">Queue Fully Processed</h3>
                  <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1 max-w-xs">All submitted assets have been verified by the oracle network.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone/50 dark:divide-white/5">
                {properties.map((p) => (
                  <div key={p._id} className="p-6 transition-colors hover:bg-sand/30 dark:hover:bg-white/[0.02]">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center shrink-0">
                          <ListTodo className="w-5 h-5 text-primary dark:text-[#E89874]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-on_surface dark:text-[#e8eaf0] truncate">
                            {p.physicalAddress}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="font-mono text-[10px] border-stone dark:border-[#2a2520] text-on_surface_variant">
                              NFT #{p.tokenId}
                            </Badge>
                            <Badge className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border-primary/20">
                              Awaiting Oracle Signature
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                        <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold uppercase tracking-wider" asChild>
                          <a href={p.documentUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-1.5 h-3.5 w-3.5" />
                            View Docs
                          </a>
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-1 hidden md:block" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 px-4 text-xs font-bold text-error hover:bg-error/10 uppercase tracking-wider"
                          onClick={() => setRejectingId(p._id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 px-5 bg-primary text-on_primary shadow-sm font-bold uppercase tracking-wider text-xs"
                          onClick={() => handleApprove(p._id, p.tokenId)}
                        >
                          Sign & Approve
                        </Button>
                      </div>
                    </div>

                    {rejectingId === p._id && (
                      <div className="mt-6 ml-0 md:ml-15 p-6 rounded-2xl bg-error/5 border border-error/10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-2 mb-4 text-error">
                          <AlertTriangle className="w-4 h-4" />
                          <p className="text-xs font-bold uppercase tracking-widest">Rejection Protocol</p>
                        </div>
                        <div className="space-y-4">
                          <Select onValueChange={setRejectReason}>
                            <SelectTrigger className="w-full bg-white dark:bg-[#1a1916]">
                              <SelectValue placeholder="Select official rejection reason..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Insufficient documentation">Insufficient documentation</SelectItem>
                              <SelectItem value="Mismatch in legal titles">Mismatch in legal titles</SelectItem>
                              <SelectItem value="Invalid digital signature">Invalid digital signature</SelectItem>
                              <SelectItem value="ULPIN does not match records">ULPIN does not match records</SelectItem>
                              <SelectItem value="Fraudulent activity detected">Fraudulent activity detected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Textarea
                            placeholder="Additional institutional notes (optional)..."
                            className="text-sm h-24 bg-white dark:bg-[#1a1916] resize-none"
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <div className="flex justify-end gap-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest"
                              onClick={() => { setRejectingId(null); setRejectReason(""); }}
                            >
                              Abort
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-9 px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg"
                              onClick={() => handleReject(p._id, p.tokenId)}
                            >
                              Finalize Rejection
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OracleGuard>
  );
}

function StatMini({ label, value, accent }: { label: string, value: number | string, accent: "primary" | "success" | "neutral" }) {
  const styles = {
    primary: "border-primary/20 bg-primary/5 text-primary",
    success: "border-success/20 bg-success/5 text-success",
    neutral: "border-stone dark:border-[#2a2520] bg-sand dark:bg-[#1a1916]",
  }[accent];

  return (
    <div className={cn("p-4 rounded-xl border flex items-center justify-between", styles)}>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-xl font-bold font-display">{value}</span>
    </div>
  );
}
