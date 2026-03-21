"use client";

import { Suspense, useEffect, useState } from "react";
import { ListTodo, CheckSquare, XSquare, AlertCircle } from "lucide-react";
import OracleGuard from "@/components/shared/OracleGuard";
import { useOracleContract } from "@/hooks/useOracleContract";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/oracle/pending");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      toast({ title: "Error fetching properties" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recordId: string, tokenId: number) => {
    try {
      toast({ title: "Approving in MetaMask..." });
      const tx = await approveOnChain(tokenId);
      // Wait for tx... (wagmi hook already returns hash after popup)
      toast({ title: "Transaction sent. Updating database..." });
      
      const res = await fetch("/api/oracle/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
      if (!res.ok) throw new Error("Failed to update db");
      
      setProperties((prev) => prev.filter((p) => p._id !== recordId));
      toast({ title: "Property approved" });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message });
    }
  };

  const handleReject = async (recordId: string, tokenId: number) => {
    if (!rejectReason) {
      toast({ title: "Please provide a rejection reason." });
      return;
    }
    try {
      toast({ title: "Rejecting in MetaMask..." });
      const tx = await rejectOnChain(tokenId, rejectReason);
      
      toast({ title: "Transaction sent. Updating database..." });
      
      const res = await fetch("/api/oracle/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, reason: rejectReason })
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Verification Queue
          </h1>
          <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
            Oracle tasks requiring manual intervention or institutional signatures.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-on_surface_variant dark:text-[#9ba3b8] mb-2">Pending Items</p>
          <p className="text-3xl font-bold text-on_surface dark:text-[#e8eaf0]">{properties.length}</p>
        </div>
        <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-warning mb-2">High Priority</p>
          <p className="text-3xl font-bold text-warning">0</p>
        </div>
        <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-success mb-2">Processed Today</p>
          <p className="text-3xl font-bold text-success">0</p>
        </div>
      </div>

      {/* List */}
      <Suspense fallback={<div className="h-48 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-shimmer" />}>
        <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)] p-6">
          <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-6">Active Tasks</h3>

          {loading ? (
            <div className="h-48 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-shimmer" />
          ) : properties.length === 0 ? (
            <p className="flex items-center gap-2 text-on_surface_variant dark:text-[#9ba3b8] py-4">
               <CheckSquare size={20} />
               No pending properties to review!
            </p>
          ) : (
            <div className="space-y-4">
              {properties.map((p) => (
                <div key={p._id} className="border border-outline_variant/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#161b27] transition-colors duration-150 ease-out gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ListTodo size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-on_surface dark:text-[#e8eaf0]">{p.physicalAddress}</p>
                      <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8]">Token ID: {p.tokenId}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                     {rejectingId === p._id ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            placeholder="Reason for rejection..."
                            className="px-2 py-1 text-sm border rounded w-full"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-md bg-error text-on_error hover:bg-error/90 whitespace-nowrap"
                            onClick={() => handleReject(p._id, p.tokenId)}
                          >
                            Confirm
                          </button>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-md bg-surface_container dark:bg-[#1c2333] text-on_surface dark:text-[#e8eaf0] whitespace-nowrap"
                            onClick={() => setRejectingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                     ) : (
                       <>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-md bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8] hover:bg-surface_container_high transition-all duration-150 hover:scale-[1.02]"
                            onClick={() => setRejectingId(p._id)}
                          >
                            Decline
                          </button>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-md bg-primary text-on_primary hover:bg-primary/90 transition-all duration-150 hover:scale-[1.02]"
                            onClick={() => handleApprove(p._id, p.tokenId)}
                          >
                            Sign & Approve
                          </button>
                       </>
                     )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </div>
    </OracleGuard>
  );
}
