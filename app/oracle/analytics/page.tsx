"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Clock, XCircle, Lock, AlertTriangle, Layers } from "lucide-react";
import OracleGuard from "@/components/shared/OracleGuard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Analytics {
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

export default function OracleAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/public", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error(`Request failed (${r.status})`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const outcomes = data
    ? [
        { label: "Approved", value: data.approved, color: "bg-success" },
        { label: "Pending", value: data.pending, color: "bg-secondary" },
        { label: "Rejected", value: data.rejected, color: "bg-error" },
      ]
    : [];
  const outcomeTotal = outcomes.reduce((s, o) => s + o.value, 0) || 1;
  const types = data ? Object.entries(data.byType) : [];
  const typeTotal = types.reduce((s, [, n]) => s + n, 0) || 1;

  return (
    <OracleGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Network Analytics
          </h1>
          <p className="text-body-md text-on_surface_variant dark:text-muted-foreground">
            Live registry-wide verification metrics.
          </p>
        </div>

        {error && (
          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
            <CardContent className="p-6 flex items-center gap-3 text-on_surface_variant dark:text-muted-foreground">
              <AlertTriangle className="text-error" size={20} />
              <span>Analytics unavailable: {error}. Ensure MONGODB_URI is configured.</span>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<Layers size={20} />} label="Total Registered" value={data?.totalProperties} loading={loading} tone="text-primary bg-primary/10" />
          <Stat icon={<CheckCircle2 size={20} />} label="Approved" value={data?.approved} loading={loading} tone="text-success bg-success/10" />
          <Stat icon={<Clock size={20} />} label="Pending" value={data?.pending} loading={loading} tone="text-secondary bg-secondary/10" />
          <Stat icon={<XCircle size={20} />} label="Rejected" value={data?.rejected} loading={loading} tone="text-error bg-error/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
            <CardContent className="p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on_surface_variant dark:text-muted-foreground mb-6 flex items-center gap-2.5">
                <BarChart3 size={14} /> Verification Outcomes
              </h3>
              <div className="space-y-4">
                {outcomes.map((o) => {
                  const pct = Math.round((o.value / outcomeTotal) * 100);
                  return (
                    <div key={o.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-on_surface dark:text-[#e8eaf0]">{o.label}</span>
                        <span className="text-on_surface_variant dark:text-muted-foreground font-mono">{o.value} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface_container dark:bg-white/5 overflow-hidden">
                        <div className={cn("h-full rounded-full", o.color)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
            <CardContent className="p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on_surface_variant dark:text-muted-foreground mb-6 flex items-center gap-2.5">
                <Layers size={14} /> Composition by Type
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
                          <span className="text-on_surface_variant dark:text-muted-foreground font-mono">{count} · {pct}%</span>
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat icon={<Lock size={20} />} label="Active Encumbrances" value={data?.activeLiens} loading={loading} tone="text-secondary bg-secondary/10" />
          <Stat icon={<AlertTriangle size={20} />} label="Open Disputes" value={data?.openDisputes} loading={loading} tone="text-error bg-error/10" />
          <Stat icon={<Layers size={20} />} label="On-chain Minted" value={data?.minted} loading={loading} tone="text-primary bg-primary/10" />
        </div>

        {data?.generatedAt && (
          <p className="text-[11px] text-on_surface_variant/60 dark:text-muted-foreground/60 text-center font-mono">
            Snapshot {new Date(data.generatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </OracleGuard>
  );
}

function Stat({
  icon, label, value, loading, tone,
}: {
  icon: React.ReactNode; label: string; value: number | undefined; loading: boolean; tone: string;
}) {
  return (
    <div className="bg-card dark:bg-card rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", tone)}>{icon}</div>
      <p className="text-[10px] uppercase font-bold text-on_surface_variant dark:text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">
        {loading ? "—" : value ?? 0}
      </p>
    </div>
  );
}
