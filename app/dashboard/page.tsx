"use client";

import { useAuth } from "@/hooks/useAuth";
import { useKYC } from "@/hooks/useKYC";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert, Wallet, ArrowRight, ShieldCheck, Building2,
  PlusCircle, ListTodo, CheckCircle2, Clock, XCircle, Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import KYCModal from "@/components/shared/KYCModal";
import OracleAccessCard from "@/components/shared/OracleAccessCard";
import { cn } from "@/lib/utils";

interface PropertyRow {
  _id?: string;
  tokenId: number | null;
  ulpin: string;
  physicalAddress: string;
  propertyType?: string;
  areaSqFt?: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const { isConnected, isConnecting, connect, address } = useWallet();
  const { kycVerified, isLoading: kycLoading } = useKYC();
  const { isOracleMode } = useOracleAccessStore();

  const [showKYC, setShowKYC] = useState(false);
  const [kycDismissed, setKycDismissed] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-stone dark:bg-card rounded-2xl w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-stone dark:bg-card rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Secure Access Required</h2>
        <p className="text-on_surface_variant dark:text-[#9ba3b8] max-w-sm">
          Please sign in to your PropChain account to access your dashboard and the property registry.
        </p>
      </div>
    );
  }

  const showKycBanner = isConnected && !kycVerified && !kycLoading && !kycDismissed;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-10">
      {/* ── BANNERS ── */}
      <div className="space-y-4">
        {!isConnected && (
          <Card className="border-dashed border-2 border-primary/30 bg-primary_fixed/10 dark:bg-[#3D1F10]/10 overflow-hidden rounded-2xl">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-[#3D1F10] flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 text-primary dark:text-[#E89874]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-on_surface dark:text-[#e8eaf0]">Connect your wallet</h3>
                <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Link MetaMask to register property NFTs and sign on-chain transactions.
                </p>
              </div>
              <Button onClick={connect} disabled={isConnecting} size="lg" className="w-full sm:w-auto px-8 rounded-xl shadow-floating">
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </Button>
            </CardContent>
          </Card>
        )}

        {showKycBanner && (
          <Card className="bg-secondary_fixed/10 dark:bg-[#3d2800]/10 border-secondary/20 rounded-2xl">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-secondary_fixed dark:bg-[#3d2800] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-secondary dark:text-[#f59e0b]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">Complete KYC verification</h3>
                <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Verify your identity (mock Aadhaar + OTP) to enable minting and transfers.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <button onClick={() => setShowKYC(true)} className="text-xs font-bold text-secondary dark:text-[#f59e0b] hover:underline flex items-center gap-1">
                    Start KYC <ArrowRight className="w-3 h-3" />
                  </button>
                  <button onClick={() => setKycDismissed(true)} className="text-xs font-medium text-on_surface_variant/60 hover:text-on_surface">
                    Remind me later
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <KYCModal isOpen={showKYC} onClose={() => setShowKYC(false)} onVerified={() => setShowKYC(false)} />

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
            {isOracleMode ? "Oracle Control Center" : `Welcome, ${user?.firstName ?? "User"}`}
          </h1>
          <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
            {isOracleMode
              ? "Review submissions and monitor registry-wide verification."
              : "Your tokenized properties and verification status."}
          </p>
        </div>
      </div>

      {!isOracleMode && <OracleAccessCard />}

      {isOracleMode ? <OracleDashboardView /> : <UserDashboardView address={address} kycVerified={kycVerified} />}
    </div>
  );
}

/* ── USER VIEW ─────────────────────────────────────────────────────────────── */
function UserDashboardView({ address, kycVerified }: { address?: string; kycVerified: boolean }) {
  const [props, setProps] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`/api/properties/owner?wallet=${address}`)
      .then((r) => (r.ok ? r.json() : { properties: [] }))
      .then((d) => setProps(d.properties ?? []))
      .catch(() => setProps([]))
      .finally(() => setLoading(false));
  }, [address]);

  const total = props.length;
  const verified = props.filter((p) => p.status === "approved").length;
  const pending = props.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My Properties" value={total} icon={<Building2 className="w-4 h-4" />} accent="primary" />
        <StatCard label="Verified" value={verified} icon={<CheckCircle2 className="w-4 h-4" />} accent="success" />
        <StatCard label="Awaiting Oracle" value={pending} icon={<Clock className="w-4 h-4" />} accent="secondary" />
        <StatCard label="KYC Status" value={kycVerified ? "Verified" : "Pending"} icon={<ShieldCheck className="w-4 h-4" />} accent="neutral" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/mint/details" />} className="rounded-xl">
          <PlusCircle className="mr-2 h-4 w-4" /> Register a property
        </Button>
        <Button variant="outline" render={<Link href="/properties" />} className="rounded-xl">
          View all properties
        </Button>
      </div>

      <RecentList
        title="Your recent properties"
        rows={props.slice(0, 6)}
        loading={loading}
        emptyMsg={address ? "You haven't registered any properties yet." : "Connect your wallet to see your properties."}
      />
    </div>
  );
}

/* ── ORACLE VIEW ───────────────────────────────────────────────────────────── */
interface Analytics {
  totalProperties: number; approved: number; pending: number; rejected: number;
  activeLiens: number; openDisputes: number;
}
function OracleDashboardView() {
  const [pending, setPending] = useState<PropertyRow[]>([]);
  const [stats, setStats] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/oracle/pending").then((r) => (r.ok ? r.json() : { properties: [] })).catch(() => ({ properties: [] })),
      fetch("/api/analytics/public").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([p, s]) => {
      setPending(p.properties ?? []);
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending Queue" value={stats?.pending ?? pending.length} icon={<ListTodo className="w-4 h-4" />} accent="primary" />
        <StatCard label="Approved" value={stats?.approved ?? 0} icon={<CheckCircle2 className="w-4 h-4" />} accent="success" />
        <StatCard label="Rejected" value={stats?.rejected ?? 0} icon={<XCircle className="w-4 h-4" />} accent="neutral" />
        <StatCard label="Total Registered" value={stats?.totalProperties ?? 0} icon={<Layers className="w-4 h-4" />} accent="secondary" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/oracle/queue" />} className="rounded-xl">
          <ListTodo className="mr-2 h-4 w-4" /> Open verification queue
        </Button>
        <Button variant="outline" render={<Link href="/oracle/analytics" />} className="rounded-xl">
          View analytics
        </Button>
      </div>

      <RecentList
        title="Submissions awaiting review"
        rows={pending.slice(0, 6)}
        loading={loading}
        emptyMsg="No pending submissions. The queue is clear."
        linkBase="/oracle/queue"
      />
    </div>
  );
}

/* ── shared ────────────────────────────────────────────────────────────────── */
function RecentList({
  title, rows, loading, emptyMsg, linkBase = "/properties",
}: {
  title: string; rows: PropertyRow[]; loading: boolean; emptyMsg: string; linkBase?: string;
}) {
  return (
    <Card className="rounded-2xl border-stone/50 dark:border-white/5">
      <CardContent className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on_surface_variant dark:text-[#9ba3b8] mb-4">{title}</h3>
        {loading ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-stone/10 dark:bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] py-6 text-center">{emptyMsg}</p>
        ) : (
          <div className="space-y-2">
            {rows.map((p) => {
              const href = p.tokenId != null ? `/properties/${p.tokenId}` : linkBase;
              return (
                <Link key={p._id ?? p.ulpin} href={href}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-stone/10 dark:hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] truncate">{p.physicalAddress || p.ulpin}</p>
                      <p className="text-[11px] font-mono text-on_surface_variant dark:text-[#9ba3b8] truncate">{p.ulpin}</p>
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusPill({ status }: { status: PropertyRow["status"] }) {
  const map = {
    approved: { label: "Verified", c: "bg-success/10 text-success" },
    pending: { label: "Pending", c: "bg-secondary/10 text-secondary" },
    rejected: { label: "Rejected", c: "bg-error/10 text-error" },
  } as const;
  const s = map[status] ?? map.pending;
  return <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0", s.c)}>{s.label}</span>;
}

function StatCard({
  label, value, icon, accent,
}: {
  label: string; value: string | number; icon: React.ReactNode;
  accent: "primary" | "secondary" | "neutral" | "success";
}) {
  const accentStyles = {
    primary: "bg-primary/5 text-primary border-primary/10",
    secondary: "bg-secondary/5 text-secondary border-secondary/10",
    neutral: "bg-stone/10 text-on_surface_variant border-stone/20 dark:bg-white/5",
    success: "bg-success/5 text-success border-success/10",
  }[accent];

  return (
    <Card className="rounded-2xl border-stone/50 dark:border-white/5">
      <CardContent className="p-5">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border mb-4", accentStyles)}>{icon}</div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-[#9ba3b8] mb-1">{label}</p>
        <p className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
