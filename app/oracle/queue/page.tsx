"use client";

import { Suspense, useEffect, useState } from "react";
import { ListTodo, CheckSquare, XSquare, Clock, RefreshCw } from "lucide-react";
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
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-on_surface dark:text-[#e8e6e2] tracking-tight">
              Verification Queue
            </h1>
            <p className="text-sm text-[#8a8480] dark:text-[#7a7470] mt-1">
              Pending properties requiring oracle sign-off.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPending}
            disabled={loading}
            className="gap-1.5 text-xs h-8 text-[#8a8480] hover:text-on_surface"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8480] dark:text-[#7a7470] mb-1.5">Pending</p>
              <p className="text-2xl font-bold text-on_surface dark:text-[#e8e6e2]">{properties.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warning mb-1.5">High Priority</p>
              <p className="text-2xl font-bold text-warning">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-success mb-1.5">Processed Today</p>
              <p className="text-2xl font-bold text-success">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Tasks</CardTitle>
            <CardDescription>Review and sign each submission on-chain</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-sand dark:bg-[#211f1c] animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-3 text-center px-6">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on_surface dark:text-[#e8e6e2]">Queue is clear</p>
                  <p className="text-xs text-[#8a8480] dark:text-[#7a7470] mt-0.5">No pending properties to review.</p>
                </div>
              </div>
            ) : (
              <div>
                {properties.map((p, i) => (
                  <div key={p._id}>
                    {i > 0 && <Separator />}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center shrink-0 mt-0.5">
                          <ListTodo className="w-4 h-4 text-primary dark:text-[#E89874]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on_surface dark:text-[#e8e6e2] truncate">
                            {p.physicalAddress}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] border-stone dark:border-[#2a2520] text-[#8a8480]">
                              Token #{p.tokenId}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] border-warning/30 text-warning bg-warning/5">
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {rejectingId === p._id ? (
                        <div className="space-y-2 pl-11">
                          <Textarea
                            placeholder="Reason for rejection…"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="text-sm h-20 resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => { setRejectingId(null); setRejectReason(""); }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs h-7 bg-error text-white hover:bg-error/90"
                              onClick={() => handleReject(p._id, p.tokenId)}
                            >
                              <XSquare className="w-3 h-3 mr-1" />
                              Confirm Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 pl-11">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 text-error border-error/30 hover:bg-error_container"
                            onClick={() => setRejectingId(p._id)}
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs h-7 bg-primary text-white hover:bg-primary/90"
                            onClick={() => handleApprove(p._id, p.tokenId)}
                          >
                            <CheckSquare className="w-3 h-3 mr-1" />
                            Sign & Approve
                          </Button>
                        </div>
                      )}
                    </div>
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
