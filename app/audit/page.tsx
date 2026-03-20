"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, Download, TrendingUp, Zap, Shield, 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  CheckCircle2, ArrowLeftRight, AlertCircle, Box
} from "lucide-react";

const auditData = [
  { 
    timestamp: "Oct 24, 2023\n14:22:10 UTC", 
    type: "Mint Asset", 
    icon: <Box size={14} className="text-primary" />,
    iconBg: "bg-primary/10",
    status: "CONFIRMED",
    statusColor: "text-success bg-success_container",
    hash: "0x4e12...b8f1",
    isLink: true 
  },
  { 
    timestamp: "Oct 24, 2023\n12:05:45 UTC", 
    type: "Verification", 
    icon: <Shield size={14} className="text-[#835500]" />,
    iconBg: "bg-[#835500]/10",
    status: "CONFIRMED",
    statusColor: "text-success bg-success_container",
    hash: "0x7a81...d2c3",
    isLink: true 
  },
  { 
    timestamp: "Oct 23, 2023\n18:50:12 UTC", 
    type: "Transfer", 
    icon: <ArrowLeftRight size={14} className="text-on_surface_variant" />,
    iconBg: "bg-surface_container",
    status: "PENDING",
    statusColor: "text-[#d97706] bg-warning/20",
    hash: "0x1b42...a991",
    isLink: true 
  },
  { 
    timestamp: "Oct 23, 2023\n09:12:33 UTC", 
    type: "Mint Asset", 
    icon: <Box size={14} className="text-primary" />,
    iconBg: "bg-primary/10",
    status: "CONFIRMED",
    statusColor: "text-success bg-success_container",
    hash: "0x8c21...f04e",
    isLink: true 
  },
  { 
    timestamp: "Oct 22, 2023\n22:30:11 UTC", 
    type: "System Action", 
    icon: <AlertCircle size={14} className="text-destructive" />,
    iconBg: "bg-destructive/10",
    status: "FAILED",
    statusColor: "text-white bg-destructive/80",
    hash: "Execution Reverted",
    isLink: false 
  },
];

export default function AuditHistoryPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
              Audit History
            </h1>
            <p className="text-body-md text-on_surface_variant">
              Immutable verification log for Organization ID: <span className="font-mono text-primary">0x882...F41A</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-4 bg-surface_container_lowest border-outline_variant/20 shadow-none text-on_surface">
              <Filter className="mr-2 h-4 w-4" />
              Filter Log
            </Button>
            <Button className="h-10 px-4 bg-primary text-on_primary shadow-floating">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface_container_low rounded-2xl p-6 shadow-sm border border-outline_variant/10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on_surface_variant mb-2">Total Events</p>
            <p className="text-3xl font-display font-bold text-on_surface tracking-tight mb-4">12,482</p>
            <div className="flex items-center text-primary text-xs font-semibold gap-1.5">
              <TrendingUp size={14} />
              +12% vs last month
            </div>
          </div>

          <div className="bg-surface_container_low rounded-2xl p-6 shadow-sm border border-outline_variant/10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on_surface_variant mb-2">Avg Gas Used</p>
            <p className="text-3xl font-display font-bold text-on_surface tracking-tight mb-4">42.8 Gwei</p>
            <div className="flex items-center text-[#835500] text-xs font-semibold gap-1.5">
              <Zap size={14} />
              Optimal Network Speed
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 shadow-floating text-on_primary flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary_fixed/80 mb-2">Network Status</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse" />
              <p className="text-2xl font-display font-bold tracking-tight">Mainnet Sync Active</p>
            </div>
            <p className="text-sm text-primary_fixed">Last block verified: #18, 244, 109 at 2s ago.</p>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-surface_container_lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-surface_container_low/50">
                <tr className="border-b border-outline_variant/20 text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">
                  <th className="py-4 px-6 font-medium">Timestamp</th>
                  <th className="py-4 px-6 font-medium">Event Type</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Transaction Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline_variant/10 block-table text-sm">
                {auditData.map((row, i) => (
                  <tr key={i} className="hover:bg-surface_container_low/30 transition-colors">
                    <td className="py-4 px-6 whitespace-pre-line text-on_surface font-medium leading-snug">
                      {row.timestamp}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.iconBg}`}>
                          {row.icon}
                        </div>
                        <span className="font-medium text-on_surface">{row.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-black/5 ${row.statusColor}`}>
                          {row.status === "CONFIRMED" && <CheckCircle2 size={10} className="fill-current text-white/40" />}
                          {row.status === "FAILED" && <AlertCircle size={10} className="fill-current text-white/40" />}
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {row.isLink ? (
                        <span className="font-mono text-primary bg-primary/5 px-2 py-1 rounded-md text-xs">{row.hash}</span>
                      ) : (
                        <span className="font-mono text-on_surface_variant italic text-xs px-2 py-1">{row.hash}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-outline_variant/20 px-6 py-4 flex items-center justify-between bg-surface_container_lowest">
            <span className="text-xs text-on_surface_variant font-medium">Showing 1 to 5 of 12,482 entries</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-outline_variant/30 text-on_surface_variant"><ChevronLeft size={14} /></Button>
              <Button variant="default" className="w-8 h-8 rounded-md bg-primary text-white p-0">1</Button>
              <Button variant="outline" className="w-8 h-8 rounded-md bg-white border-outline_variant/30 text-on_surface p-0">2</Button>
              <Button variant="outline" className="w-8 h-8 rounded-md bg-white border-outline_variant/30 text-on_surface p-0">3</Button>
              <span className="px-2 text-on_surface_variant">...</span>
              <Button variant="outline" className="w-8 h-8 rounded-md bg-white border-outline_variant/30 text-on_surface p-0">492</Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-outline_variant/30 text-on_surface_variant"><ChevronRight size={14} /></Button>
            </div>
          </div>
        </div>

        {/* Bottom Banner Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface_container_lowest rounded-2xl p-8 shadow-sm border border-outline_variant/10">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary" />
              <h3 className="text-xl font-bold font-display text-on_surface">Immutable Proof</h3>
            </div>
            <p className="text-on_surface_variant text-sm leading-relaxed max-w-sm mb-6">
              Every action in this history is cryptographically signed and hashed into the blockchain. Click any transaction hash to view full block data on the public explorer.
            </p>
            <a href="#" className="inline-flex items-center text-primary text-sm font-semibold hover:opacity-80 transition-opacity">
              Learn about Blockchain Audits <ArrowRight size={16} className="ml-1" />
            </a>
          </div>

          <div className="rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden bg-[#ffe8cc] border border-[#f5d0a9]">
            <div className="relative z-10 w-full md:max-w-[85%]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-[#835500]" />
                <h3 className="text-xl font-bold font-display text-[#3a2600]">Smart Auditor Beta</h3>
              </div>
              <p className="text-[#5c3c00] text-sm leading-relaxed mb-6">
                Our AI engine has flagged <span className="font-bold border-b border-[#5c3c00]">2 events</span> that might require your manual verification this week. Review your queue to maintain compliance.
              </p>
              <Button className="bg-[#1f1400] text-[#fdecd8] hover:bg-black border-none rounded-lg h-10 px-6 font-semibold shadow-none w-fit">
                Go to Queue
              </Button>
            </div>
            {/* abstract map shape decoration right side */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-1/4 translate-y-1/4">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-[#835500]">
                 <path d="M14.73 2.03L9.27 4.76V21.97L14.73 19.24V2.03ZM2 4.76V21.97L7.45 19.24V2.03L2 4.76ZM21.97 2.03L16.55 4.76V21.97L21.97 19.24V2.03Z"/>
               </svg>
            </div>
          </div>
        </div>

      </div>
  );
}
