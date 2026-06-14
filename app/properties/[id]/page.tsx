"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { MapPin, History, Building2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransferCard from "@/components/shared/TransferCard";
import ProtectionsCard from "@/components/shared/ProtectionsCard";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DisplayProperty {
  assetId: string;
  address: string;
  ulpin: string;
  area: string;
  type: string;
  owner: string;
  statusUi: "verified" | "awaiting_oracle" | "rejected";
  registeredAt: string;
  docUrl?: string;
  tokenId: number | null;
}

interface HistoryEvent {
  type: string;
  category: string;
  txHash: string;
  timestamp: number | null;
}

function mapStatus(s: string): DisplayProperty["statusUi"] {
  if (s === "approved" || s === "verified") return "verified";
  if (s === "rejected") return "rejected";
  return "awaiting_oracle";
}

export default function PropertyIdPage() {
  const params = useParams();
  const id = params.id as string;
  const mock = usePropertyStore((s) => s.properties.find((p) => p.id === id));

  const [view, setView] = useState<DisplayProperty | null>(null);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [histLoading, setHistLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/properties/token/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((rec) => {
        if (cancelled) return;
        if (rec && rec.ulpin) {
          setView({
            assetId: rec.tokenId != null ? `#${rec.tokenId}` : id,
            address: rec.physicalAddress,
            ulpin: rec.ulpin,
            area: rec.areaSqFt ? `${rec.areaSqFt.toLocaleString("en-IN")} sq ft` : "—",
            type: rec.propertyType ?? "Property",
            owner: rec.walletAddress ?? "",
            statusUi: mapStatus(rec.status),
            registeredAt: rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "—",
            docUrl: rec.documentUrl || undefined,
            tokenId: rec.tokenId ?? null,
          });
        } else if (mock) {
          setView({
            assetId: mock.id,
            address: mock.address,
            ulpin: mock.ulpin,
            area: `${mock.area.toLocaleString("en-IN")} sq ft`,
            type: mock.type,
            owner: mock.owner,
            statusUi: mapStatus(mock.status),
            registeredAt: mock.registeredAt,
            tokenId: Number.isNaN(Number(mock.id)) ? null : Number(mock.id),
          });
        }
      })
      .catch(() => {
        if (!cancelled && mock) {
          setView({
            assetId: mock.id, address: mock.address, ulpin: mock.ulpin,
            area: `${mock.area.toLocaleString("en-IN")} sq ft`, type: mock.type,
            owner: mock.owner, statusUi: mapStatus(mock.status),
            registeredAt: mock.registeredAt, tokenId: null,
          });
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id, mock]);

  useEffect(() => {
    let cancelled = false;
    setHistLoading(true);
    fetch(`/api/properties/${id}/history`)
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => !cancelled && setEvents(d.events ?? []))
      .catch(() => !cancelled && setEvents([]))
      .finally(() => !cancelled && setHistLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-1/3 bg-stone/20 dark:bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-stone/10 dark:bg-card rounded-2xl" />
          <div className="h-96 bg-stone/10 dark:bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!view) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md text-on_surface dark:text-[#e8eaf0] font-semibold">Property not found</p>
        <p className="text-body-md text-on_surface_variant dark:text-muted-foreground">
          No registered property matches this id.
        </p>
        <Link href="/properties"><Button>Back to My Properties</Button></Link>
      </div>
    );
  }

  const truncate = (s: string, a: number, b: number) =>
    !s ? "—" : s.length <= a + b ? s : `${s.slice(0, a)}...${s.slice(-b)}`;

  const statusPill = {
    verified: { label: "Verified", c: "bg-success/10 text-success" },
    awaiting_oracle: { label: "Awaiting Oracle", c: "bg-secondary/10 text-secondary" },
    rejected: { label: "Rejected", c: "bg-error/10 text-error" },
  }[view.statusUi];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            {view.address}
          </h1>
          <p className="text-body-md text-on_surface_variant dark:text-muted-foreground flex items-center gap-2">
            <MapPin size={16} /> Asset ID: <span className="font-mono text-primary">{view.assetId}</span>
          </p>
        </div>
        <span className={cn("self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full", statusPill.c)}>
          {statusPill.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Metadata */}
        <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
          <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-primary/40" />
          </div>
          <h3 className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-4">Core Metadata</h3>
          <div className="space-y-3 text-sm">
            <Row label="Owner Wallet"><span className="font-mono text-primary">{truncate(view.owner, 6, 4)}</span></Row>
            <Row label="ULPIN"><span className="text-on_surface dark:text-[#e8eaf0] font-medium font-mono">{view.ulpin}</span></Row>
            <Row label="Area"><span className="text-on_surface dark:text-[#e8eaf0] font-medium">{view.area}</span></Row>
            <Row label="Type"><span className="text-on_surface dark:text-[#e8eaf0] font-medium">{view.type}</span></Row>
            <Row label="Registered"><span className="text-on_surface dark:text-[#e8eaf0] font-medium">{view.registeredAt}</span></Row>
            {view.docUrl && (
              <Row label="Document">
                <a href={view.docUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium inline-flex items-center gap-1 hover:underline">
                  <FileText size={14} /> View
                </a>
              </Row>
            )}
          </div>
        </div>

        {/* Right column: transfer + audit */}
        <div className="space-y-8">
        <TransferCard tokenId={view.tokenId} ownerWallet={view.owner} statusUi={view.statusUi} />
        <ProtectionsCard tokenId={view.tokenId} ulpin={view.ulpin} />
        <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Audit Trail</h3>
              <p className="text-xs text-on_surface_variant dark:text-muted-foreground">On-chain history events</p>
            </div>
          </div>

          {histLoading ? (
            <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-12 bg-stone/10 dark:bg-white/5 rounded-xl animate-pulse" />)}</div>
          ) : events.length === 0 ? (
            <p className="text-sm text-on_surface_variant dark:text-muted-foreground italic">
              No on-chain events found yet. Events appear here once the contract is deployed and the property is minted/approved.
            </p>
          ) : (
            <ol className="space-y-4">
              {events.map((e, i) => (
                <li key={`${e.txHash}-${i}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                    {i < events.length - 1 && <span className="w-px flex-1 bg-outline_variant/30 my-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">{e.type}</p>
                    <p className="text-[11px] text-on_surface_variant dark:text-muted-foreground">
                      {e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"}
                    </p>
                    {e.txHash && <p className="text-[10px] font-mono text-primary/70 truncate max-w-[240px]">{e.txHash}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-outline_variant/10 pb-2">
      <span className="text-on_surface_variant dark:text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
