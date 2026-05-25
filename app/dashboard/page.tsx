"use client";

import { useAuth } from "@/hooks/useAuth";
import { useKYC } from "@/hooks/useKYC";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, Calendar, ShieldAlert, Wallet, X, ArrowRight, 
  TrendingUp, TrendingDown, Clock, ShieldCheck, 
  Activity, BarChart3, Database, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PortfolioChart from "./components/PortfolioChart";
import VerificationSummaryCard from "./components/AIIntelligenceCard";
import NetworkTelemetry from "./components/NetworkTelemetry";
import AssetSpiderChart from "@/components/shared/AssetSpiderChart";
import KYCModal from "@/components/shared/KYCModal";
import OracleAccessCard from "@/components/shared/OracleAccessCard";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const { isConnected, isConnecting, connect, chain } = useWallet();
  const { kycVerified, isLoading: kycLoading } = useKYC();
  const { isOracleMode } = useOracleAccessStore();

  const [showKYC, setShowKYC] = useState(false);
  const [kycDismissed, setKycDismissed] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-stone dark:bg-card rounded-2xl w-1/3" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-stone dark:bg-card rounded-2xl" />)}
        </div>
        <div className="h-64 bg-stone dark:bg-card rounded-2xl" />
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
          Please sign in to your PropChain account to access your institutional dashboard and asset registry.
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
                <h3 className="text-base font-bold text-on_surface dark:text-[#e8eaf0]">Connect Institutional Wallet</h3>
                <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Link your hardware or institutional wallet to manage property NFTs and sign legal attestations.
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
                <h3 className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">Regulatory Compliance Required</h3>
                <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Complete your identity verification to enable asset minting and cross-border transfers.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <button onClick={() => setShowKYC(true)} className="text-xs font-bold text-secondary dark:text-[#f59e0b] hover:underline flex items-center gap-1">
                    Start KYC Audit <ArrowRight className="w-3 h-3" />
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
              ? "System-wide verification throughput and network consensus metrics."
              : "Global real estate liquidity metrics and your fractional portfolio overview."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 px-4 bg-white dark:bg-card border-stone dark:border-white/5 text-xs font-bold uppercase tracking-widest rounded-xl">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Live View
          </Button>
          <Button size="sm" className="h-10 px-6 text-xs font-bold uppercase tracking-widest rounded-xl shadow-floating">
            <Download className="mr-2 h-3.5 w-3.5" />
            Report
          </Button>
        </div>
      </div>

      {!isOracleMode && <OracleAccessCard />}

      {/* ── ROLE-BASED DASHBOARD CONTENT ── */}
      {isOracleMode ? (
        <OracleDashboardView />
      ) : (
        <UserDashboardView />
      )}

      {/* ── TELEMETRY (Common) ── */}
      <NetworkTelemetry />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ORACLE VIEW
   ────────────────────────────────────────────────────────────────────────── */
function OracleDashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Queue"
          value="0"
          delta="0"
          deltaPositive
          accent="primary"
          icon={<Activity className="w-4 h-4" />}
          subtext="Submissions to review"
        />
        <StatCard
          label="Verification Time"
          value="0s"
          delta="0s"
          deltaPositive
          accent="success"
          icon={<Clock className="w-4 h-4" />}
          subtext="Avg. AI processing"
        />
        <StatCard
          label="Oracle Consensus"
          value="0%"
          delta="0%"
          deltaPositive
          accent="secondary"
          icon={<ShieldCheck className="w-4 h-4" />}
          subtext="Node health status"
        />
        <StatCard
          label="Data Stored"
          value="0"
          delta="0"
          deltaPositive
          accent="neutral"
          icon={<Database className="w-4 h-4" />}
          subtext="IPFS registry size"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card border-stone/50">
          <CardHeader>
            <CardTitle className="text-base">System Throughput</CardTitle>
            <CardDescription>Real-time verification volume vs node capacity</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PortfolioChart />
          </CardContent>
        </Card>
        
        <VerificationSummaryCard />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   USER VIEW
   ────────────────────────────────────────────────────────────────────────── */
function UserDashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value="$0"
          delta="0%"
          deltaPositive
          accent="primary"
          icon={<BarChart3 className="w-4 h-4" />}
          subtext="Real-world asset value"
        />
        <StatCard
          label="Monthly Yield"
          value="$0"
          delta="0%"
          deltaPositive
          accent="success"
          icon={<TrendingUp className="w-4 h-4" />}
          subtext="Rental distributions"
        />
        <StatCard
          label="Active Stakes"
          value="0"
          delta="0"
          deltaPositive
          accent="secondary"
          icon={<ShieldCheck className="w-4 h-4" />}
          subtext="Properties verified"
        />
        <StatCard
          label="Liquidity Score"
          value="0"
          delta="0"
          deltaPositive
          accent="neutral"
          icon={<Globe className="w-4 h-4" />}
          subtext="Instant exit potential"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card border-stone/50">
          <CardHeader>
            <CardTitle className="text-base">Portfolio Performance</CardTitle>
            <CardDescription>Asset appreciation and yield growth (30d)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PortfolioChart />
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden shadow-card border-stone/50">
          <CardHeader>
            <CardTitle className="text-base">Asset Composition</CardTitle>
            <CardDescription>Registry distribution by type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <AssetSpiderChart />
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-card rounded-2xl p-6 border border-stone dark:border-white/5 overflow-hidden relative min-h-[320px] flex flex-col shadow-card">
        <div className="relative z-10">
          <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0]">Global Registry Hotspots</h3>
          <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">Real-time property minting density by jurisdiction</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center opacity-80 mix-blend-multiply dark:mix-blend-normal dark:opacity-95">
          <div className="w-[400px] h-[400px] rounded-full bg-sand dark:bg-white/5 shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 dark:bg-black/10 z-10" />
            <div className="w-[150%] h-[150%] rounded-full border border-primary/10 -rotate-45" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="text-[11px] font-bold text-on_surface_variant/70 dark:text-[#9ba3b8] uppercase tracking-widest">
                No registry data yet
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-card to-transparent z-10" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SHARED COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  accent: "primary" | "secondary" | "neutral" | "success";
  icon: React.ReactNode;
  subtext?: string;
}

function StatCard({ label, value, delta, deltaPositive, accent, icon, subtext }: StatCardProps) {
  const accentStyles = {
    primary:   "bg-primary/5 text-primary border-primary/10",
    secondary: "bg-secondary/5 text-secondary border-secondary/10",
    neutral:   "bg-stone/10 text-on_surface_variant border-stone/20 dark:bg-white/5",
    success:   "bg-success/5 text-success border-success/10",
  }[accent];

  const isNeutralDelta = delta === "0" || delta === "0%" || delta === "0s";

  return (
    <Card className="rounded-2xl border-stone/50 dark:border-white/5 transition-all hover:border-primary/20 dark:hover:bg-white/[0.02] group overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors group-hover:scale-110 duration-300", accentStyles)}>
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
            isNeutralDelta
              ? "text-on_surface_variant bg-stone/10 border-stone/20 dark:bg-white/5"
              : deltaPositive
                ? "text-success bg-success/5 border-success/10"
                : "text-error bg-error/5 border-error/10"
          )}>
            {isNeutralDelta ? null : (deltaPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />)}
            {delta}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-[#9ba3b8] mb-1">{label}</p>
          <p className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">{value}</p>
          {subtext && (
            <p className="text-[11px] text-on_surface_variant/60 dark:text-[#6d6861] mt-2 font-medium">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
