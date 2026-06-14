"use client";

import { useEffect, useState } from "react";
import { BarChart3, Building2, ShieldCheck, AlertTriangle, Lock, RefreshCw } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PublicAnalytics {
  totalProperties: number;
  minted: number;
  pending: number;
  approved: number;
  rejected: number;
  activeLiens: number;
  openDisputes: number;
  byType: Record<string, number>;
  generatedAt: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<PublicAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/public", { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const types = data ? Object.entries(data.byType) : [];
  const typeTotal = types.reduce((s, [, n]) => s + n, 0) || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex items-end justify-between pt-8 gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <BarChart3 size={24} />
          </div>
          <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl">
            Network Analytics
          </h1>
          <p className="text-base text-on_surface_variant dark:text-muted-foreground max-w-2xl font-medium mt-2">
            Public, real-time statistics for the entire PropChain registry.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl bg-surface_container_high dark:bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-on_surface_variant hover:text-primary transition-colors"
        >
          <RefreshCw size={14} className={cn(loading && "animate-spin")} /> Refresh
        </button>
      </div>

      {error ? (
        <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
          <CardContent className="p-6 flex items-center gap-3 text-on_surface_variant dark:text-muted-foreground">
            <AlertTriangle className="text-error" size={20} />
            <div>
              <p className="font-semibold text-on_surface dark:text-[#e8eaf0]">Analytics unavailable</p>
              <p className="text-sm">{error}. Ensure MONGODB_URI is configured.</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Properties" value={data?.totalProperties ?? "—"} />
        <StatCard
          label="Verified"
          value={data?.approved ?? "—"}
          accentColor="text-success dark:text-[#4ade80]"
        />
        <StatCard label="Awaiting Oracle" value={data?.pending ?? "—"} />
        <StatCard label="On-chain Minted" value={data?.minted ?? "—"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={<Lock size={18} />}
          label="Active Encumbrances"
          value={data?.activeLiens ?? 0}
          tone="text-secondary"
        />
        <InfoCard
          icon={<AlertTriangle size={18} />}
          label="Open Disputes"
          value={data?.openDisputes ?? 0}
          tone="text-error"
        />
        <InfoCard
          icon={<ShieldCheck size={18} />}
          label="Rejected"
          value={data?.rejected ?? 0}
          tone="text-on_surface_variant"
        />
      </div>

      <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
        <CardContent className="p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on_surface_variant dark:text-muted-foreground mb-6 flex items-center gap-2.5">
            <Building2 size={14} /> Composition by Asset Type
          </h3>
          {types.length === 0 ? (
            <p className="text-sm text-on_surface_variant dark:text-muted-foreground">No data yet.</p>
          ) : (
            <div className="space-y-4">
              {types.map(([type, count]) => {
                const pct = Math.round((count / typeTotal) * 100);
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-on_surface dark:text-[#e8eaf0]">{type}</span>
                      <span className="text-on_surface_variant dark:text-muted-foreground font-mono">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface_container dark:bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {data?.generatedAt ? (
        <p className="text-[11px] text-on_surface_variant/60 dark:text-muted-foreground/60 text-center font-mono">
          Snapshot generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1916] rounded-xl p-5 border border-stone dark:border-[#2a2520] flex items-center gap-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-surface_container_high dark:bg-white/5", tone)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-on_surface_variant dark:text-[#9b9690]">{label}</p>
        <p className="text-headline-md font-display tracking-tight text-on_surface dark:text-[#e8e6e2]">{value}</p>
      </div>
    </div>
  );
}
