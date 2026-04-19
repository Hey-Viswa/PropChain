"use client";
import OracleGuard from "@/components/shared/OracleGuard";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Wallet,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowLeft,
  Flag,
  FileText,
  RefreshCw,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, any> = {
  LOGIN: Clock,
  WALLET_CONNECT: Wallet,
  KYC_SUBMIT: Shield,
  PROPERTY_REGISTER: FileText,
  DOCUMENT_UPLOAD: FileText,
  AI_SCAN: Activity,
  TRANSFER_INIT: ArrowLeft,
  TRANSFER_COMPLETE: CheckCircle,
  ORACLE_APPROVE: CheckCircle,
  ORACLE_REJECT: AlertTriangle,
  FRAUD_FLAG: Flag,
  LIEN_ADDED: AlertTriangle,
  LIEN_RELEASED: CheckCircle,
  PROFILE_UPDATE: User,
};

const ACTIVITY_COLORS: Record<string, string> = {
  LOGIN: "bg-primary/10 text-primary dark:text-[#E89874]",
  WALLET_CONNECT: "bg-primary/10 text-primary dark:text-[#E89874]",
  KYC_SUBMIT: "bg-success/5 text-success",
  PROPERTY_REGISTER: "bg-primary/10 text-primary dark:text-[#E89874]",
  DOCUMENT_UPLOAD: "bg-stone/10 dark:bg-white/5 text-on_surface_variant dark:text-muted-foreground",
  AI_SCAN: "bg-primary/10 text-primary dark:text-[#E89874]",
  TRANSFER_INIT: "bg-secondary/5 text-secondary dark:text-[#ffddb4]",
  TRANSFER_COMPLETE: "bg-success/5 text-success",
  ORACLE_APPROVE: "bg-success/5 text-success",
  ORACLE_REJECT: "bg-error/5 text-error",
  FRAUD_FLAG: "bg-error/5 text-error",
  LIEN_ADDED: "bg-error/5 text-error",
  LIEN_RELEASED: "bg-success/5 text-success",
  PROFILE_UPDATE: "bg-stone/10 dark:bg-white/5 text-on_surface_variant dark:text-muted-foreground",
};

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OracleUserDetailPage() {
  return (
    <OracleGuard>
      <OracleUserDetailContent />
    </OracleGuard>
  );
}

function OracleUserDetailContent() {
  const { clerkId } = useParams<{ clerkId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/oracle/users/${clerkId}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clerkId]);

  const filteredLogs =
    data?.logs?.filter((log: any) => {
      if (filter === "flagged") return log.flagged;
      if (filter === "all") return true;
      return log.type === filter;
    }) ?? [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-stone/20 dark:bg-card rounded-xl" />
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-stone/20 dark:bg-card rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-stone/20 dark:bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  const { user, logs, stats } = data ?? {};

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-20">
      <div className="flex items-center gap-3">
        <Link
          href="/oracle/users"
          className="p-2 rounded-xl text-on_surface_variant dark:text-muted-foreground hover:bg-stone/10 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-stone/20"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
            {user?.name ?? user?.email?.split("@")[0] ?? "Unknown User"}
          </h1>
          <p className="text-xs font-mono text-on_surface_variant dark:text-muted-foreground opacity-60">{clerkId}</p>
        </div>
        <button
          onClick={fetchData}
          className="ml-auto p-2 rounded-xl bg-white dark:bg-card border border-stone/50 dark:border-white/10 text-on_surface_variant dark:text-muted-foreground hover:text-on_surface dark:hover:text-[#e8eaf0] shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-card rounded-[32px] overflow-hidden shadow-sm border border-stone/50 dark:border-white/10">
            <div className="h-1.5 bg-primary" />
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <p className="text-base font-bold font-display text-on_surface dark:text-[#e8eaf0]">Identity Profile</p>
              </div>

              {[
                { label: "Full Name", value: user?.name ?? user?.email?.split("@")[0] ?? "-" },
                { label: "Institutional Email", value: user?.email ?? "-" },
                {
                  label: "Compliance Status",
                  value: user?.role && user.role !== "USER" ? "✓ Verified" : "Unverified",
                  color: user?.role && user.role !== "USER" ? "text-success" : "text-error",
                },
                {
                  label: "Connected Wallet",
                  value: user?.walletAddress
                    ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-6)}`
                    : "Not linked",
                  mono: true,
                },
                {
                  label: "Account Created",
                  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "-",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground font-bold mb-1 opacity-60">
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold text-on_surface dark:text-[#e8eaf0]",
                      item.color,
                      item.mono && "font-mono text-xs bg-stone/5 dark:bg-white/5 p-2 rounded-xl border border-stone/20 dark:border-white/5"
                    )}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-[32px] overflow-hidden shadow-sm border border-stone/50 dark:border-white/10">
            <div className="h-1.5 bg-secondary" />
            <div className="p-6 space-y-4">
              <p className="text-base font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Activity Overview</p>

              {[
                {
                  label: "Total Session Actions",
                  value: stats?.totalActions ?? 0,
                },
                {
                  label: "Anomalous Events",
                  value: stats?.flaggedCount ?? 0,
                  color: stats?.flaggedCount > 0 ? "text-error" : "text-success",
                },
                {
                  label: "Genesis Interaction",
                  value: stats?.firstSeen ? new Date(stats.firstSeen).toLocaleDateString("en-IN") : "-",
                },
                {
                  label: "Last Recorded Sync",
                  value: stats?.lastSeen ? timeAgo(stats.lastSeen) : "-",
                  color: "text-primary",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3.5 bg-sand/30 dark:bg-white/5 rounded-xl border border-stone/20 dark:border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground opacity-70">{s.label}</p>
                  <p className={cn("text-sm font-black font-display", s.color || "text-on_surface dark:text-[#e8eaf0]")}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {stats?.flaggedCount === 0 && (
            <button className="w-full flex items-center justify-center gap-2 p-4 border border-error/30 text-error rounded-xl text-xs font-black uppercase tracking-widest hover:bg-error/5 transition-all active:scale-[0.98]">
              <Flag className="w-4 h-4" />
              Flag Verification
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-card rounded-[32px] overflow-hidden shadow-sm border border-stone/50 dark:border-white/10">
          <div className="h-1.5 bg-primary/20" />
          <div className="p-6 xl:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0]">Institutional Timeline</p>
              <div className="flex gap-2 bg-sand/50 dark:bg-white/5 p-1 rounded-xl border border-stone/30 dark:border-white/5">
                {["all", "flagged"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      filter === f
                        ? f === "flagged"
                          ? "bg-error text-white shadow-lg"
                          : "bg-primary text-on_primary shadow-lg"
                        : "text-on_surface_variant dark:text-muted-foreground hover:bg-stone/10 dark:hover:bg-white/5"
                    )}
                  >
                    {f === "all" ? "All Logs" : "Anomalies"}
                  </button>
                ))}
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 rounded-3xl bg-stone/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-stone/10 dark:border-white/5">
                  <Activity className="w-8 h-8 text-on_surface_variant/20" />
                </div>
                <p className="text-sm font-bold text-on_surface_variant dark:text-muted-foreground opacity-40 uppercase tracking-widest">No activity sequences found</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-stone/20 dark:bg-white/10" />

                <div className="space-y-6">
                  {filteredLogs.map((log: any, i: number) => {
                    const Icon = ACTIVITY_ICONS[log.type] ?? Activity;
                    const colorClass = ACTIVITY_COLORS[log.type] ?? "bg-stone/10 text-on_surface_variant";

                    return (
                      <div key={log._id ?? i} className="flex gap-5 relative pl-1 group">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 shadow-sm border border-white/20",
                          colorClass
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div
                          className={cn(
                            "flex-1 p-5 rounded-2xl transition-all border",
                            log.flagged
                              ? "bg-error/5 border-error/20"
                              : "bg-sand/20 dark:bg-white/[0.02] border-stone/20 dark:border-white/5 hover:border-primary/20"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] leading-tight">
                                {log.description}
                              </p>
                              {log.flagged && log.flagReason && (
                                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-error tracking-widest bg-error/10 px-2 py-0.5 rounded">
                                  <AlertTriangle className="w-3 h-3" />
                                  {log.flagReason}
                                </div>
                              )}
                              {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {Object.entries(log.metadata)
                                    .slice(0, 4)
                                    .map(([k, v]: any) => (
                                      <span
                                        key={k}
                                        className="text-[9px] font-mono font-bold bg-white dark:bg-white/5 text-on_surface_variant dark:text-muted-foreground px-2 py-1 rounded-xl border border-stone/20 dark:border-white/5"
                                      >
                                        {k.toUpperCase()}: {String(v)}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-left sm:text-right border-l sm:border-l-0 sm:border-r border-stone/20 dark:border-white/10 pl-3 sm:pl-0 sm:pr-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground opacity-60 whitespace-nowrap">
                                {timeAgo(log.createdAt)}
                              </p>
                              {log.ipAddress && log.ipAddress !== "unknown" && (
                                <p className="text-[9px] font-mono text-primary/60 mt-1 uppercase tracking-tighter">
                                  IP: {log.ipAddress}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
