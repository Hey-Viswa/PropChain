"use client";


import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import PortfolioChart from "./components/PortfolioChart";
import AIIntelligenceCard from "./components/AIIntelligenceCard";
import NetworkTelemetry from "./components/NetworkTelemetry";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
              System Analytics
            </h1>
            <p className="text-body-md text-on_surface_variant max-w-xl">
              Real-time performance metrics for global asset liquidity and verification throughput.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-4 bg-surface_container_lowest border-outline_variant/20 shadow-none text-on_surface">
              <Calendar className="mr-2 h-4 w-4 text-on_surface_variant" />
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
          <div className="bg-surface_container_lowest rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {/* Generic icon */}
                <div className="w-4 h-4 rounded-sm border-2 border-primary" />
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant mb-1 font-medium">Total Value Locked</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface tracking-tight">$4.28B</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-surface_container_lowest rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <div className="w-4 h-4 rounded-full bg-secondary opacity-60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-surface_container_lowest" />
                </div>
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+4.1%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant mb-1 font-medium">Asset Liquidity</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface tracking-tight">88.2%</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-surface_container_lowest rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-on_surface_variant/10 flex items-center justify-center text-on_surface_variant">
                <div className="w-4 h-4 rounded-full border-2 border-on_surface_variant relative">
                  <div className="absolute top-1 left-1.5 w-[2px] h-2 bg-on_surface_variant rotate-45" />
                </div>
              </div>
              <span className="text-xs font-semibold text-warning bg-warning/10 text-[#d97706] px-2 py-0.5 rounded-full">-2.5m</span>
            </div>
            <p className="text-label-sm text-on_surface_variant mb-1 font-medium">Avg. Verification Time</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface tracking-tight">14.8m</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-surface_container_lowest rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on_primary">
                <ShieldIcon />
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">99.9%</span>
            </div>
            <p className="text-label-sm text-on_surface_variant mb-1 font-medium">Integrity Score</p>
            <p className="text-2xl xl:text-3xl font-bold font-display text-on_surface tracking-tight">AA+</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          <div className="lg:col-span-2 bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold font-display text-on_surface">Portfolio Growth</h3>
                <p className="text-xs text-on_surface_variant">Asset minting vs secondary market volume</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-on_surface_variant">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Minted</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary" /> Volume</div>
              </div>
            </div>
            <PortfolioChart />
          </div>

          <div className="lg:col-span-1 bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10 flex flex-col items-center">
            <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold font-display text-on_surface">Asset Composition</h3>
              <p className="text-xs text-on_surface_variant">System-wide registry distribution</p>
            </div>
            
            {/* Custom SVG House graphic */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
                {/* Roof blue */}
                <path d="M 20 100 L 100 20 L 180 100" fill="none" stroke="#0050b2" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                {/* Right wall brown */}
                <path d="M 175 95 L 175 160 L 60 180" fill="none" stroke="#835500" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                {/* Base abstract shape */}
                <rect x="50" y="60" width="100" height="100" rx="8" fill="#f3f3fa" />
              </svg>
              <div className="relative z-10 text-center bg-surface_container_lowest/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-2xl font-bold font-display text-on_surface leading-none">1.2k</p>
                <p className="text-[9px] font-bold text-on_surface_variant uppercase tracking-widest mt-1">Total Assets</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /><span className="text-on_surface font-medium">Residential</span></div>
                <span className="text-on_surface_variant font-medium">62%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#835500]" /><span className="text-on_surface font-medium">Commercial</span></div>
                <span className="text-on_surface_variant font-medium">24%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-outline_variant" /><span className="text-on_surface font-medium">Industrial</span></div>
                <span className="text-on_surface_variant font-medium">14%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          {/* Globe */}
          <div className="lg:col-span-2 bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10 overflow-hidden relative min-h-[320px] flex flex-col">
            <div className="relative z-10">
              <h3 className="text-lg font-bold font-display text-on_surface">Regional Activity</h3>
              <p className="text-xs text-on_surface_variant">Real-time hotspots by transaction density</p>
            </div>
            
            {/* Globe Graphic placeholder */}
            <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center opacity-80 mix-blend-multiply">
              <div className="w-[400px] h-[400px] rounded-full bg-surface_container_high/50 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#fff_70%)] z-10" />
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
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
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
