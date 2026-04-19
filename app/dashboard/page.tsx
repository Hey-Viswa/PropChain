"use client";

import { useAuth } from "@/hooks/useAuth";
import { useKYC } from "@/hooks/useKYC";
import { useWallet } from "@/hooks/useWallet";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ShieldAlert, Wallet, X, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PortfolioChart from "./components/PortfolioChart";
import VerificationSummaryCard from "./components/AIIntelligenceCard";
import NetworkTelemetry from "./components/NetworkTelemetry";
import AssetSpiderChart from "@/components/shared/AssetSpiderChart";
import KYCModal from "@/components/shared/KYCModal";
import OracleAccessCard from "@/components/shared/OracleAccessCard";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const { isConnected, isConnecting, connect } = useWallet();
  const { kycVerified, isLoading: kycLoading } = useKYC();

  const [showKYC, setShowKYC] = useState(false);
  const [kycDismissed, setKycDismissed] = useState(false);

  if (!isLoaded) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        {[80, 60, 40].map((w) => (
          <div key={w} className={`h-4 bg-stone dark:bg-[#2a2520] rounded w-${w}`} />
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <h2 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Please sign in</h2>
        <p className="text-on_surface_variant dark:text-[#9ba3b8]">You must be signed in to view this page.</p>
      </div>
    );
  }

  const showKycBanner = isConnected && !kycVerified && !kycLoading && !kycDismissed;

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── WALLET CONNECT BANNER ── */}
      {!isConnected && (
        <div className="rounded-xl border-2 border-dashed border-primary/30 dark:border-[#3D1F10] bg-primary_fixed/30 dark:bg-[#3D1F10]/20 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-[#3D1F10] flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-primary dark:text-[#E89874]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-title-sm font-bold text-on_surface dark:text-[#e8eaf0]">
                Connect your wallet to get started
              </p>
              <p className="text-body-sm text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">
                Link a wallet to manage properties, view portfolio, and sign transactions.
              </p>
            </div>
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="flex-shrink-0 bg-primary text-on_primary hover:opacity-90 shadow-none gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting…" : "Connect Wallet"}
              {!isConnecting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* ── KYC BANNER ── */}
      {showKycBanner && (
        <div className="rounded-xl bg-secondary_fixed/30 dark:bg-[#3d2800]/30 border border-secondary/20 dark:border-[#5c3a00] p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary_fixed dark:bg-[#3d2800] flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-secondary dark:text-[#f59e0b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-title-sm font-bold text-on_surface dark:text-[#e8eaf0]">
                Complete KYC Verification
              </p>
              <p className="text-body-sm text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">
                Identity verification is required to register and transfer properties on-chain.
              </p>
              <button
                onClick={() => setShowKYC(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-label-sm font-semibold text-secondary dark:text-[#f59e0b] hover:opacity-80 transition-opacity"
              >
                Start verification <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => setKycDismissed(true)}
              className="p-1.5 rounded-lg text-on_surface_variant dark:text-[#9ba3b8] hover:bg-surface_container dark:hover:bg-[#1c2333] transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <KYCModal
        isOpen={showKYC}
        onClose={() => setShowKYC(false)}
        onVerified={() => setShowKYC(false)}
      />

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight leading-tight">
            Good morning, {user?.firstName ?? "there"}.
          </h1>
          <p className="text-body-sm sm:text-body-md text-on_surface_variant dark:text-[#9ba3b8] mt-1 max-w-xl">
            Real-time performance metrics for asset liquidity and verification throughput.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" className="h-9 px-3 sm:px-4 bg-white dark:bg-[#1a1916] border-stone dark:border-[#2a2520] shadow-none text-on_surface dark:text-[#e8eaf0] text-sm">
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-on_surface_variant dark:text-[#9ba3b8]" />
            <span className="hidden sm:inline">Last 30 Days</span>
            <span className="sm:hidden">30d</span>
          </Button>
          <Button className="h-9 px-3 sm:px-4 bg-primary text-on_primary shadow-none hover:opacity-90 text-sm">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* ── ORACLE ACCESS CARD ── */}
      <OracleAccessCard />

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-5">
        <StatCard
          label="Total Value Locked"
          value="$4.28B"
          delta="+12.4%"
          deltaPositive
          accent="primary"
          icon={<TvlIcon />}
        />
        <StatCard
          label="Asset Liquidity"
          value="88.2%"
          delta="+4.1%"
          deltaPositive
          accent="secondary"
          icon={<LiquidityIcon />}
        />
        <StatCard
          label="Avg. Verification"
          value="14.8m"
          delta="-2.5m"
          deltaPositive
          accent="neutral"
          icon={<ClockIcon />}
        />
        <StatCard
          label="Integrity Score"
          value="AA+"
          delta="99.9%"
          deltaPositive
          accent="success"
          icon={<ShieldCheckIcon />}
        />
      </div>

      {/* ── CHARTS ROW ── */}
      <Suspense fallback={<div className="h-48 bg-stone dark:bg-[#2a2520] rounded-xl animate-pulse" />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-5">
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1916] rounded-xl p-5 sm:p-6 border border-stone dark:border-[#2a2520]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold font-display text-on_surface dark:text-[#e8eaf0]">Portfolio Growth</h3>
                <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">Asset minting vs secondary market volume</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-on_surface_variant dark:text-[#9ba3b8]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />Minted</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary" />Volume</div>
              </div>
            </div>
            <PortfolioChart />
          </div>

          <div className="bg-white dark:bg-[#1a1916] rounded-xl p-5 border border-stone dark:border-[#2a2520] flex flex-col">
            <div className="mb-5">
              <p className="text-base font-bold font-display text-on_surface dark:text-[#e8eaf0]">Asset Composition</p>
              <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">System-wide registry distribution</p>
            </div>
            <div className="flex-1 flex items-start">
              <AssetSpiderChart />
            </div>
          </div>
        </div>
      </Suspense>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-5">
        {/* Regional Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1916] rounded-xl p-5 sm:p-6 border border-stone dark:border-[#2a2520] overflow-hidden relative min-h-[280px] sm:min-h-[320px] flex flex-col">
          <div className="relative z-10">
            <h3 className="text-base font-bold font-display text-on_surface dark:text-[#e8eaf0]">Regional Activity</h3>
            <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">Real-time hotspots by transaction density</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center opacity-80 mix-blend-multiply dark:mix-blend-normal dark:opacity-95">
            <div className="w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-surface_container_high/50 dark:bg-[#1f2532] shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#fff_70%)] dark:bg-[radial-gradient(circle_at_center,transparent_35%,#0f1117_75%)] z-10" />
              <div className="w-[150%] h-[150%] rounded-full border-4 border-outline_variant/20 -rotate-45" />
              <div className="absolute w-[150%] h-[150%] rounded-[100%] border-2 border-outline_variant/10 rotate-12" />
              <div className="absolute w-full h-[30%] border-y-2 border-outline_variant/20" />
              <div className="absolute w-[30%] h-full border-x-2 border-outline_variant/20" />
              <div className="absolute top-[30%] left-[25%] bg-primary text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full z-20 shadow-sm">Singapore: High</div>
              <div className="absolute top-[60%] left-[50%] bg-[#835500] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full z-20 shadow-sm opacity-90">London: Emerging</div>
              <div className="absolute bottom-[20%] right-[25%] bg-primary/80 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full z-20 shadow-sm">New York: Peak</div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-[#1a1916] to-transparent z-10" />
        </div>
        <VerificationSummaryCard />
      </div>

      {/* ── TELEMETRY TABLE ── */}
      <NetworkTelemetry />
    </div>
  );
}

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
  const iconBg = {
    primary:   "bg-primary_fixed dark:bg-[#3D1F10] text-primary dark:text-[#E89874]",
    secondary: "bg-secondary/10 text-secondary",
    neutral:   "bg-sand dark:bg-[#2a2520] text-on_surface_variant dark:text-[#9b9690]",
    success:   "bg-success/10 text-success",
  }[accent];

  return (
    <Card className="p-4 sm:p-5 border-stone dark:border-[#2a2520]">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          deltaPositive ? "text-success bg-success/10" : "text-error bg-error/10"
        }`}>
          {deltaPositive
            ? <TrendingUp className="w-2.5 h-2.5" />
            : <TrendingDown className="w-2.5 h-2.5" />
          }
          {delta}
        </div>
      </div>
      <p className="text-[10px] sm:text-[11px] text-on_surface_variant dark:text-[#9b9690] font-semibold uppercase tracking-[0.06em] mb-1.5 leading-tight">{label}</p>
      <p className="text-xl sm:text-2xl xl:text-[28px] font-bold font-display text-on_surface dark:text-[#e8e6e2] tracking-tight leading-none">{value}</p>
      {subtext && (
        <p className="text-[10px] text-on_surface_variant/60 dark:text-[#6b6560] mt-1.5">{subtext}</p>
      )}
    </Card>
  );
}

function TvlIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function LiquidityIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}
function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function ShieldCheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>;
}
