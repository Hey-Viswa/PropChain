"use client";

import { useAuth } from "@/hooks/useAuth";
import { useKYC } from "@/hooks/useKYC";
import { useWallet } from "@/hooks/useWallet";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Wallet, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import PortfolioChart from "./components/PortfolioChart";
import AIIntelligenceCard from "./components/AIIntelligenceCard";
import NetworkTelemetry from "./components/NetworkTelemetry";
import AssetSpiderChart from "@/components/shared/AssetSpiderChart";

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const { isConnected, isConnecting, connect } = useWallet();
  const { kycVerified, loading, checking, submitKYC } = useKYC();
  
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) {
    return <div className="p-8 text-center text-on_surface_variant dark:text-[#9ba3b8]">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Please sign in</h2>
        <p className="text-on_surface_variant dark:text-[#9ba3b8]">You must be signed in to view this page.</p>
      </div>
    );
  }

  const showOverlay = (!isConnected) || (isConnected && !kycVerified && !checking);

  return (
    <div className="space-y-6 relative">
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4">
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10 max-w-md w-full text-center">
            {!isConnected ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Wallet className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Connect Wallet</h2>
                <p className="text-on_surface_variant dark:text-[#9ba3b8] mb-8 text-sm">
                  Connect your wallet to manage properties and view your portfolio.
                </p>
                <Button onClick={connect} disabled={isConnecting} className="w-full bg-primary text-on_primary h-12 text-base shadow-floating">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center text-warning mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Pending KYC</h2>
                <p className="text-on_surface_variant dark:text-[#9ba3b8] mb-6 text-sm">
                  Please verify your identity using your Aadhaar number to unlock dashboard features.
                </p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-on_surface dark:text-[#e8eaf0] mb-1">Aadhaar Number</label>
                    <Input
                      type="password"
                      placeholder="12-digit Aadhaar Number"
                      value={aadhaar}
                      onChange={(e) => { setAadhaar(e.target.value); setError(""); }}
                      maxLength={12}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on_surface dark:text-[#e8eaf0] mb-1">Fake OTP</label>
                    <Input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setError(""); }}
                      maxLength={6}
                      className="w-full"
                    />
                  </div>

                  {error && <p className="text-error text-sm font-medium tracking-tight bg-error/10 p-2 rounded">{error}</p>}

                  <Button
                    onClick={async () => {
                      if (aadhaar.length !== 12) {
                        setError("Aadhaar must be exactly 12 digits.");
                        return;
                      }
                      const res = await submitKYC(aadhaar);
                      if (!res.success) {
                        setError(res.error || "Submission failed.");
                      }
                    }}
                    disabled={loading || aadhaar.length !== 12 || otp.length < 6}
                    className="w-full bg-primary text-on_primary h-12 text-base shadow-floating mt-4"
                  >
                    {loading ? "Verifying..." : "Submit KYC"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
              Good morning, {user?.firstName ?? "there"}.
            </h1>
            <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] max-w-xl">
              Real-time performance metrics for global asset liquidity and verification throughput.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-4 bg-surface_container_lowest dark:bg-[#131820] border-outline_variant/20 shadow-none text-on_surface dark:text-[#e8eaf0]">
              <Calendar className="mr-2 h-4 w-4 text-on_surface_variant dark:text-[#9ba3b8]" />
              Last 30 Days
            </Button>
            <Button className="h-10 px-4 bg-primary text-on_primary shadow-floating">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
          {/* Stat 1 */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {/* Generic icon */}
                <div className="w-4 h-4 rounded-sm border-2 border-primary" />
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1 font-medium">Total Value Locked</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">$4.28B</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <div className="w-4 h-4 rounded-full bg-secondary opacity-60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-surface_container_lowest dark:bg-[#131820]" />
                </div>
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+4.1%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1 font-medium">Asset Liquidity</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">88.2%</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-on_surface_variant/10 flex items-center justify-center text-on_surface_variant dark:text-[#9ba3b8]">
                <div className="w-4 h-4 rounded-full border-2 border-on_surface_variant relative">
                  <div className="absolute top-1 left-1.5 w-[2px] h-2 bg-on_surface_variant rotate-45" />
                </div>
              </div>
              <span className="text-xs font-semibold text-warning bg-warning/10 text-[#d97706] px-2 py-0.5 rounded-full">-2.5m</span>
            </div>
            <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1 font-medium">Avg. Verification Time</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">14.8m</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on_primary">
                <ShieldIcon />
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">99.9%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1 font-medium">Integrity Score</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">AA+</p>
          </div>
        </div>

        {/* Charts Row */}
        <Suspense fallback={<div className="h-48 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-shimmer" />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
            <div className="lg:col-span-2 bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0]">Portfolio Growth</h3>
                  <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8]">Asset minting vs secondary market volume</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-on_surface_variant dark:text-[#9ba3b8]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Minted</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary" /> Volume</div>
                </div>
              </div>
              <PortfolioChart />
            </div>

            <div className="lg:col-span-1 bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6 flex flex-col h-full shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
              <div className="mb-6">
                <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0]">
                  Asset Composition
                </p>
                <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                  System-wide registry distribution
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center py-4">
                <AssetSpiderChart />
              </div>
            </div>
          </div>
        </Suspense>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          {/* Globe */}
          <div className="lg:col-span-2 bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10 overflow-hidden relative min-h-[320px] flex flex-col">
            <div className="relative z-10">
              <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0]">Regional Activity</h3>
              <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8]">Real-time hotspots by transaction density</p>
            </div>
            
            {/* Globe Graphic placeholder */}
            <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center opacity-80 mix-blend-multiply dark:mix-blend-normal dark:opacity-95">
              <div className="w-[400px] h-[400px] rounded-full bg-surface_container_high/50 dark:bg-[#1f2532] shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#fff_70%)] dark:bg-[radial-gradient(circle_at_center,transparent_35%,#0f1117_75%)] z-10" />
                {/* Simulated map lines */}
                <div className="w-[150%] h-[150%] rounded-full border-4 border-outline_variant/20 -rotate-45" />
                <div className="absolute w-[150%] h-[150%] rounded-[100%] border-2 border-outline_variant/10 rotate-12 delay-150" />
                <div className="absolute w-full h-[30%] border-y-2 border-outline_variant/20" />
                <div className="absolute w-[30%] h-full border-x-2 border-outline_variant/20" />
                
                {/* Pointers */}
                <div className="absolute top-[30%] left-[25%] bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-sm">
                  Singapore: High
                </div>
                <div className="absolute top-[60%] left-[50%] bg-[#835500] text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-sm opacity-90">
                  London: Emerging
                </div>
                <div className="absolute bottom-[20%] right-[25%] bg-primary/80 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 shadow-sm">
                  New York: Peak
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-[#131820] to-transparent z-10" />
          </div>

          <AIIntelligenceCard />
        </div>

        {/* Telemetry Table */}
        <NetworkTelemetry />
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
