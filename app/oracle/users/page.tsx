"use client";

import OracleGuard from "@/components/shared/OracleGuard";
import { useState, useEffect, useCallback } from "react";
import {
  Search, RefreshCw, User, AlertTriangle, Clock, ChevronRight, Activity, Shield,
} from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface UserEntry {
  _id: string;
  walletAddress: string;
  lastActive: string;
  totalActions: number;
  flaggedCount: number;
  userData: { name?: string; email?: string; kycVerified?: boolean } | null;
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
      const params = new URLSearchParams({ search: debouncedSearch, filter });
      const res = await fetch(`/api/oracle/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const flaggedCount = users.filter((u) => u.flaggedCount > 0).length;
  const kycCount = users.filter((u) => u.userData?.kycVerified).length;
  const activeCount = users.filter((u) => (Date.now() - new Date(u.lastActive).getTime()) / 3600000 < 24).length;

  const filters = [
    { key: "all", label: "All" },
    { key: "flagged", label: "Flagged" },
    { key: "active", label: "Active" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-on_surface dark:text-[#e8e6e2] tracking-tight">
            User Monitoring
          </h1>
          <p className="text-sm text-[#8a8480] dark:text-[#7a7470] mt-1">
            Monitor all user activity and flag suspicious behaviour.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {flaggedCount > 0 && (
            <Badge className="bg-error/10 text-error border-error/20 border text-[10px] gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              {flaggedCount} flagged
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="gap-1.5 text-xs h-8 text-[#8a8480] hover:text-on_surface"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Users",   value: users.length,  color: "text-on_surface dark:text-[#e8e6e2]" },
          { label: "KYC Verified",  value: kycCount,       color: "text-success" },
          { label: "Flagged",       value: flaggedCount,   color: "text-error" },
          { label: "Active Today",  value: activeCount,    color: "text-primary dark:text-[#E89874]" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8480] dark:text-[#7a7470] mb-1.5">
                {stat.label}
              </p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8480] dark:text-[#7a7470] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or wallet…"
            className="pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-9 text-xs px-3",
                filter !== f.key && "border-stone dark:border-[#2a2520] text-[#8a8480] dark:text-[#7a7470]"
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* User list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Users</CardTitle>
          <CardDescription>Click a user to view full activity log</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-sand dark:bg-[#211f1c] animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-3 px-6 text-center">
              <div className="w-10 h-10 rounded-full bg-sand dark:bg-[#211f1c] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#8a8480]" />
              </div>
              <p className="text-sm text-[#8a8480] dark:text-[#7a7470]">No users found</p>
            </div>
          ) : (
            <div>
              {users.map((user, i) => (
                <div key={user._id}>
                  {i > 0 && <Separator />}
                  <Link
                    href={`/oracle/users/${user._id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-sand dark:hover:bg-[#211f1c] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary dark:text-[#E89874]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-on_surface dark:text-[#e8e6e2] truncate">
                          {user.userData?.name ?? "Unknown User"}
                        </p>
                        {user.userData?.kycVerified && (
                          <Badge className="bg-success/10 text-success border-success/20 border text-[9px] gap-0.5 px-1.5 py-0.5">
                            <Shield className="w-2.5 h-2.5" /> KYC
                          </Badge>
                        )}
                        {user.flaggedCount > 0 && (
                          <Badge className="bg-error/10 text-error border-error/20 border text-[9px] gap-0.5 px-1.5 py-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {user.flaggedCount} flag{user.flaggedCount > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-[#8a8480] dark:text-[#7a7470] font-mono truncate">
                          {user._id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-[#8a8480] dark:text-[#7a7470] flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {user.totalActions} actions
                        </span>
                        <span className="text-[11px] text-[#8a8480] dark:text-[#7a7470] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(user.lastActive)}
                        </span>
                        {user.walletAddress && (
                          <span className="text-[11px] text-[#8a8480] dark:text-[#7a7470] font-mono hidden sm:block">
                            {user.walletAddress.slice(0, 6)}…{user.walletAddress.slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#8a8480] group-hover:text-primary dark:group-hover:text-[#E89874] transition-colors flex-shrink-0" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
