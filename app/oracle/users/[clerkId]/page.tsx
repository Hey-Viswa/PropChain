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
  LOGIN: "bg-primary_fixed dark:bg-[#3D1F10] text-primary dark:text-[#E89874]",
  WALLET_CONNECT: "bg-primary_fixed dark:bg-[#3D1F10] text-primary dark:text-[#E89874]",
  KYC_SUBMIT: "bg-success_container dark:bg-[#0a2e1a] text-success",
  PROPERTY_REGISTER: "bg-primary_fixed dark:bg-[#3D1F10] text-primary dark:text-[#E89874]",
  DOCUMENT_UPLOAD: "bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8]",
  AI_SCAN: "bg-primary_fixed dark:bg-[#3D1F10] text-primary dark:text-[#E89874]",
  TRANSFER_INIT: "bg-secondary_fixed dark:bg-[#2a1a00] text-secondary dark:text-[#ffddb4]",
  TRANSFER_COMPLETE: "bg-success_container dark:bg-[#0a2e1a] text-success",
  ORACLE_APPROVE: "bg-success_container dark:bg-[#0a2e1a] text-success",
  ORACLE_REJECT: "bg-error_container dark:bg-[#2d0a0a] text-error",
  FRAUD_FLAG: "bg-error_container dark:bg-[#2d0a0a] text-error",
  LIEN_ADDED: "bg-error_container dark:bg-[#2d0a0a] text-error",
  LIEN_RELEASED: "bg-success_container dark:bg-[#0a2e1a] text-success",
  PROFILE_UPDATE: "bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8]",
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
        <div className="h-8 w-40 bg-surface_container rounded-lg" />
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-surface_container dark:bg-[#1c2333] rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-surface_container dark:bg-[#1c2333] rounded-xl" />
        </div>
      </div>
    );
  }

  const { user, logs, stats } = data ?? {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/oracle/users"
          className="p-2 rounded-lg text-on_surface_variant dark:text-[#9ba3b8] hover:bg-surface_container dark:hover:bg-[#1c2333] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0]">
            {user?.name ?? user?.email?.split("@")[0] ?? "Unknown User"}
          </h1>
          <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] font-mono">{clerkId}</p>
        </div>
        <button
          onClick={fetchData}
          className="ml-auto p-2 rounded-lg bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="h-1 bg-gradient-to-r from-primary to-primary_container" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center">
                  <User className="w-5 h-5 text-primary dark:text-[#E89874]" />
                </div>
                <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0]">Profile</p>
              </div>

              {[
                { label: "Name", value: user?.name ?? user?.email?.split("@")[0] ?? "-" },
                { label: "Email", value: user?.email ?? "-" },
                {
                  label: "KYC",
                  value: user?.role && user.role !== "USER" ? "✓ Verified" : "Not verified",
                  color: user?.role && user.role !== "USER" ? "text-success" : "text-error",
                },
                {
                  label: "Wallet",
                  value: user?.walletAddress
                    ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-6)}`
                    : "Not connected",
                  mono: true,
                },
                {
                  label: "Joined",
                  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "-",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-wider text-on_surface_variant dark:text-[#9ba3b8] font-bold mb-0.5">
                    {item.label}
                  </p>
                  <p
                    className={`text-body-md font-medium ${item.color ?? "text-on_surface dark:text-[#e8eaf0]"} ${
                      item.mono ? "font-mono text-sm" : ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-success to-success/50" />
            <div className="p-5 space-y-3">
              <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0] mb-4">Activity Stats</p>

              {[
                {
                  label: "Total Actions",
                  value: stats?.totalActions ?? 0,
                  color: "text-on_surface dark:text-[#e8eaf0]",
                },
                {
                  label: "Flagged Events",
                  value: stats?.flaggedCount ?? 0,
                  color: stats?.flaggedCount > 0 ? "text-error" : "text-success",
                },
                {
                  label: "First Seen",
                  value: stats?.firstSeen ? new Date(stats.firstSeen).toLocaleDateString("en-IN") : "-",
                  color: "text-on_surface dark:text-[#e8eaf0]",
                },
                {
                  label: "Last Active",
                  value: stats?.lastSeen ? timeAgo(stats.lastSeen) : "-",
                  color: "text-primary dark:text-[#E89874]",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 bg-surface_container_low dark:bg-[#161b27] rounded-xl">
                  <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">{s.label}</p>
                  <p className={`text-body-md font-semibold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {stats?.flaggedCount === 0 && (
            <button className="w-full flex items-center justify-center gap-2 p-3 border border-error/30 text-error rounded-xl text-body-md font-medium hover:bg-error_container dark:hover:bg-[#2d0a0a] transition-colors">
              <Flag className="w-4 h-4" />
              Flag This User
            </button>
          )}
        </div>

        <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="h-1 bg-gradient-to-r from-secondary to-secondary/50" />
          <div className="p-5 xl:p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0]">Activity Timeline</p>
              <div className="flex gap-2">
                {["all", "flagged"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-label-sm font-medium transition-colors ${
                      filter === f
                        ? f === "flagged"
                          ? "bg-error text-white"
                          : "bg-primary text-on_primary"
                        : "bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8]"
                    }`}
                  >
                    {f === "all" ? "All" : "Flagged"}
                  </button>
                ))}
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center">
                <Activity className="w-10 h-10 text-on_surface_variant/20 dark:text-[#9ba3b8]/20 mx-auto mb-3" />
                <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">No activity found</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-outline_variant/20 dark:bg-[#1c2333]" />

                <div className="space-y-4">
                  {filteredLogs.map((log: any, i: number) => {
                    const Icon = ACTIVITY_ICONS[log.type] ?? Activity;
                    const colorClass =
                      ACTIVITY_COLORS[log.type] ??
                      "bg-surface_container dark:bg-[#1c2333] text-on_surface_variant";

                    return (
                      <div key={log._id ?? i} className="flex gap-4 relative pl-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div
                          className={`flex-1 p-3 rounded-xl transition-colors ${
                            log.flagged
                              ? "bg-error_container/30 dark:bg-[#2d0a0a]/50 border border-error/20"
                              : "bg-surface_container_low dark:bg-[#161b27]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-body-md font-medium text-on_surface dark:text-[#e8eaf0]">
                                {log.description}
                              </p>
                              {log.flagged && log.flagReason && (
                                <p className="text-label-sm text-error mt-1 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {log.flagReason}
                                </p>
                              )}
                              {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {Object.entries(log.metadata)
                                    .slice(0, 3)
                                    .map(([k, v]: any) => (
                                      <span
                                        key={k}
                                        className="text-[10px] font-mono bg-surface_container dark:bg-[#222b3d] text-on_surface_variant dark:text-[#9ba3b8] px-2 py-0.5 rounded"
                                      >
                                        {k}: {String(v)}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] whitespace-nowrap">
                                {timeAgo(log.createdAt)}
                              </p>
                              {log.ipAddress && log.ipAddress !== "unknown" && (
                                <p className="text-[10px] font-mono text-on_surface_variant/50 dark:text-[#9ba3b8]/40 mt-0.5">
                                  {log.ipAddress}
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
