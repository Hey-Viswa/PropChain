"use client";
import OracleGuard from "@/components/shared/OracleGuard";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  User,
  AlertTriangle,
  Clock,
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

interface UserEntry {
  _id: string;
  walletAddress: string;
  lastActive: string;
  totalActions: number;
  flaggedCount: number;
  userData: {
    name?: string;
    email?: string;
    kycVerified?: boolean;
  } | null;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function OracleUsersPage() {
  return (
    <OracleGuard>
      <OracleUsersContent />
    </OracleGuard>
  );
}

function OracleUsersContent() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 300);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        filter,
      });
      const res = await fetch(`/api/oracle/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const flaggedCount = users.filter((u) => u.flaggedCount > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0]">
            User Monitoring
          </h1>
          <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mt-1">
            Monitor all user activity and flag suspicious behavior
          </p>
        </div>

        <div className="flex items-center gap-2">
          {flaggedCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label-sm font-medium bg-error_container dark:bg-[#2d0a0a] text-error">
              <AlertTriangle className="w-3.5 h-3.5" />
              {flaggedCount} flagged
            </span>
          )}
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on_surface_variant dark:text-[#9ba3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Clerk ID or wallet..."
            className="w-full bg-surface_container_lowest dark:bg-[#131820] rounded-xl pl-10 pr-4 py-2.5 text-body-md text-on_surface dark:text-[#e8eaf0] border-0 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-[#6b9eff] placeholder:text-on_surface_variant/50 dark:placeholder:text-[#9ba3b8]/40"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: "all", label: "All Users" },
            { key: "flagged", label: "Flagged" },
            { key: "active", label: "Active Today" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-label-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-on_primary"
                  : "bg-surface_container_lowest dark:bg-[#131820] text-on_surface_variant dark:text-[#9ba3b8] hover:bg-surface_container dark:hover:bg-[#1c2333]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "text-on_surface dark:text-[#e8eaf0]" },
          {
            label: "KYC Verified",
            value: users.filter((u) => u.userData?.kycVerified).length,
            color: "text-success",
          },
          { label: "Flagged", value: flaggedCount, color: "text-error" },
          {
            label: "Active Today",
            value: users.filter((u) => {
              const h = (Date.now() - new Date(u.lastActive).getTime()) / 3600000;
              return h < 24;
            }).length,
            color: "text-primary dark:text-[#6b9eff]",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-4">
            <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1">{stat.label}</p>
            <p className={`text-headline-md font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="h-1 bg-gradient-to-r from-primary to-primary_container" />

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center px-6">
            <Activity className="w-10 h-10 text-on_surface_variant/30 dark:text-[#9ba3b8]/20 mx-auto mb-3" />
            <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-outline_variant/10 dark:divide-[#1c2333]">
            {users.map((user) => (
              <Link
                key={user._id}
                href={`/oracle/users/${user._id}`}
                className="flex items-center gap-4 p-5 hover:bg-surface_container_low dark:hover:bg-[#161b27] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary_fixed dark:bg-[#1a2d4d] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary dark:text-[#6b9eff]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-body-md font-medium text-on_surface dark:text-[#e8eaf0] truncate">
                      {user.userData?.name ?? "Unknown User"}
                    </p>
                    {user.userData?.kycVerified && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-success_container dark:bg-[#0a2e1a] text-success">
                        KYC ✓
                      </span>
                    )}
                    {user.flaggedCount > 0 && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-error_container dark:bg-[#2d0a0a] text-error flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {user.flaggedCount} flag{user.flaggedCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] font-mono truncate mt-0.5">
                    {user._id}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {user.totalActions} actions
                    </span>
                    <span className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(user.lastActive)}
                    </span>
                    {user.walletAddress && (
                      <span className="text-label-sm font-mono text-on_surface_variant dark:text-[#9ba3b8] hidden sm:block">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-on_surface_variant dark:text-[#9ba3b8] group-hover:text-primary dark:group-hover:text-[#6b9eff] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
