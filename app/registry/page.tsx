"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Globe, Search, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Row {
  _id?: string;
  tokenId: number | null;
  ulpin: string;
  physicalAddress: string;
  propertyType?: string;
  areaSqFt?: number;
  status: "pending" | "approved" | "rejected";
}

const FILTERS = [
  { label: "All", value: "" },
  { label: "Verified", value: "approved" },
  { label: "Pending", value: "pending" },
] as const;

export default function RegistryPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      params.set("limit", "50");
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      const data = res.ok ? await res.json() : { results: [] };
      setRows(data.results ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  // Initial load (and on filter change) shows the latest records.
  useEffect(() => { run(); /* eslint-disable-next-line */ }, [status]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="text-center pt-12 pb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 shadow-sm">
          <Globe size={32} />
        </div>
        <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-4xl sm:text-5xl mb-4">
          Public Property Registry
        </h1>
        <p className="text-lg text-on_surface_variant dark:text-muted-foreground max-w-2xl mx-auto font-medium">
          Search verified and pending property records on the PropChain network.
        </p>
      </div>

      <Card className="rounded-2xl p-2 border-stone/50 dark:bg-card dark:border-white/5 shadow-floating flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant dark:text-muted-foreground w-5 h-5 opacity-40" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="Search by ULPIN or address…"
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none outline-none text-on_surface dark:text-[#e8eaf0] font-medium placeholder:text-on_surface_variant/40"
          />
        </div>
        <Button onClick={run} disabled={loading} className="h-12 px-10 bg-primary rounded-xl text-on_primary font-bold uppercase tracking-widest text-xs shadow-lg">
          {loading ? "Searching…" : "Search"}
        </Button>
      </Card>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[0.75rem] font-medium transition-colors",
              status === f.value
                ? "bg-primary text-on_primary"
                : "bg-surface_container dark:bg-white/5 text-on_surface_variant hover:bg-surface_container_high"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on_surface_variant dark:text-muted-foreground flex items-center gap-2.5 opacity-60">
          <div className="w-2 h-2 rounded-full bg-success" /> {rows.length} record{rows.length === 1 ? "" : "s"}
        </h3>

        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-24 bg-stone/10 dark:bg-card rounded-2xl animate-pulse" />)
        ) : rows.length === 0 ? (
          <Card className="rounded-2xl border-stone/30 dark:bg-card dark:border-white/5 p-12 text-center">
            <p className="text-on_surface_variant dark:text-muted-foreground">
              {searched ? "No properties match your search." : "No properties registered yet."}
            </p>
          </Card>
        ) : (
          rows.map((item) => {
            const href = item.tokenId != null ? `/properties/${item.tokenId}` : "#";
            return (
              <Link key={item._id ?? item.ulpin} href={href}>
                <Card className="rounded-2xl border-stone/30 dark:bg-card dark:border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-stone/10 dark:bg-white/5 flex items-center justify-center text-on_surface_variant dark:text-muted-foreground border border-stone/20 dark:border-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      <Building2 size={28} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on_surface dark:text-[#e8eaf0] text-xl tracking-tight group-hover:text-primary transition-colors truncate">
                        {item.physicalAddress || item.ulpin}
                      </h4>
                      <p className="text-sm text-on_surface_variant dark:text-muted-foreground flex items-center gap-2 mt-1.5 font-medium">
                        <span className="font-mono text-xs opacity-60">{item.ulpin}</span>
                        <span className="opacity-20">•</span>
                        <span>{item.propertyType ?? "Property"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:text-right shrink-0">
                    <div className="hidden sm:block">
                      <p className="text-[10px] uppercase font-bold text-on_surface_variant dark:text-muted-foreground mb-1 opacity-50 tracking-wider">Area</p>
                      <p className="font-bold text-on_surface dark:text-[#e8eaf0] text-lg">
                        {item.areaSqFt ? `${item.areaSqFt.toLocaleString("en-IN")} sq ft` : "—"}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      item.status === "approved" ? "bg-success/10 text-success"
                        : item.status === "rejected" ? "bg-error/10 text-error"
                        : "bg-secondary/10 text-secondary"
                    )}>
                      {item.status === "approved" ? "Verified" : item.status}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-stone/5 dark:bg-white/5 flex items-center justify-center text-on_surface_variant dark:text-[#e8eaf0] group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
