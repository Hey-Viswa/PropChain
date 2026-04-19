"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, Download, TrendingUp, Zap, Shield, 
  ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  CheckCircle2, ArrowLeftRight, AlertCircle, Box, Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const auditData = [
  { 
    timestamp: "Oct 24, 2023\n14:22:10 UTC", 
    type: "Mint Asset", 
    icon: <Box size={14} className="text-primary" />,
    iconBg: "bg-primary/5",
    status: "CONFIRMED",
    statusColor: "text-success bg-success/5 border-success/10",
    hash: "0x4e12...b8f1",
    isLink: true 
  },
  { 
    timestamp: "Oct 24, 2023\n12:05:45 UTC", 
    type: "Verification", 
    icon: <Shield size={14} className="text-secondary" />,
    iconBg: "bg-secondary/5",
    status: "CONFIRMED",
    statusColor: "text-success bg-success/5 border-success/10",
    hash: "0x7a81...d2c3",
    isLink: true 
  },
  { 
    timestamp: "Oct 23, 2023\n18:50:12 UTC", 
    type: "Transfer", 
    icon: <ArrowLeftRight size={14} className="text-on_surface_variant dark:text-muted-foreground" />,
    iconBg: "bg-stone/10 dark:bg-white/5",
    status: "PENDING",
    statusColor: "text-warning bg-warning/5 border-warning/10",
    hash: "0x1b42...a991",
    isLink: true 
  },
  { 
    timestamp: "Oct 23, 2023\n09:12:33 UTC", 
    type: "Mint Asset", 
    icon: <Box size={14} className="text-primary" />,
    iconBg: "bg-primary/5",
    status: "CONFIRMED",
    statusColor: "text-success bg-success/5 border-success/10",
    hash: "0x8c21...f04e",
    isLink: true 
  },
  { 
    timestamp: "Oct 22, 2023\n22:30:11 UTC", 
    type: "System Action", 
    icon: <AlertCircle size={14} className="text-destructive" />,
    iconBg: "bg-destructive/5",
    status: "FAILED",
    statusColor: "text-destructive bg-destructive/5 border-destructive/10",
    hash: "Execution Reverted",
    isLink: false 
  },
];

export default function AuditHistoryPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
              Institutional Audit Log
            </h1>
            <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mt-1">
              Immutable verification history for Organization ID: <span className="font-mono text-primary font-bold">0x882...F41A</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-5 bg-white dark:bg-card border-stone dark:border-white/5 text-[10px] font-bold uppercase tracking-widest rounded-xl">
              <Filter className="mr-2 h-3.5 w-3.5" />
              Filter Log
            </Button>
            <Button className="h-10 px-6 bg-primary text-on_primary shadow-floating text-[10px] font-bold uppercase tracking-widest rounded-xl">
              <Download className="mr-2 h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 shadow-sm overflow-hidden group">
            <CardContent className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on_surface_variant dark:text-[#9ba3b8] mb-1 opacity-60">Total Events</p>
              <p className="text-3xl font-display font-bold text-on_surface dark:text-[#e8eaf0] tracking-tight">12,482</p>
              <div className="mt-4 flex items-center text-success text-[10px] font-bold uppercase tracking-wider gap-1.5">
                <TrendingUp size={12} />
                +12.4% vs last period
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 shadow-sm overflow-hidden group">
            <CardContent className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on_surface_variant dark:text-[#9ba3b8] mb-1 opacity-60">Avg Network Latency</p>
              <p className="text-3xl font-display font-bold text-on_surface dark:text-[#e8eaf0] tracking-tight">42.8ms</p>
              <div className="mt-4 flex items-center text-secondary text-[10px] font-bold uppercase tracking-wider gap-1.5">
                <Zap size={12} />
                Optimal throughput
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-primary border-none shadow-floating overflow-hidden relative">
            <CardContent className="p-6 text-on_primary flex flex-col justify-center h-full">
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-1">Network Status</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <p className="text-2xl font-display font-bold tracking-tight">Mainnet Sync</p>
                </div>
                <p className="text-[10px] font-medium text-white/80 uppercase tracking-widest font-mono">Last block verified: #18,244,109</p>
              </div>
              <div className="absolute right-[-10%] top-[-20%] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </CardContent>
          </Card>
        </div>

        {/* Audit Table */}
        <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-stone/30 dark:border-white/5 bg-sand/30 dark:bg-white/[0.02]">
                  <th className="py-5 px-8 text-[10px] font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-[0.2em]">Event Type</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-[0.2em]">Status</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-[0.2em]">Hash / Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/20 dark:divide-white/5 text-sm">
                {auditData.map((row, i) => (
                  <tr key={i} className="hover:bg-sand/20 dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="py-5 px-8 whitespace-pre-line text-on_surface dark:text-[#e8eaf0] font-mono text-[11px] leading-relaxed opacity-80">
                      {row.timestamp}
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border border-transparent group-hover:border-current/10 transition-all", row.iconBg)}>
                          {row.icon}
                        </div>
                        <span className="font-bold text-[13px] text-on_surface dark:text-[#e8eaf0]">{row.type}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest border uppercase flex items-center gap-1.5 w-fit", row.statusColor)}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      {row.isLink ? (
                        <span className="font-mono text-primary bg-primary/5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer hover:bg-primary hover:text-white transition-all">
                          {row.hash}
                        </span>
                      ) : (
                        <span className="font-mono text-on_surface_variant dark:text-[#9ba3b8] italic text-[11px] px-2 py-1 opacity-50">{row.hash}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-stone/30 dark:border-white/5 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-sand/10 dark:bg-transparent">
            <span className="text-[11px] font-bold text-on_surface_variant/50 dark:text-[#6d6861] uppercase tracking-widest">Showing 1 to 5 of 12,482 entries</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl bg-white dark:bg-transparent border-stone dark:border-[#2a2520] text-on_surface_variant"><ChevronLeft size={14} /></Button>
              <Button className="w-8 h-8 rounded-xl bg-primary text-on_primary p-0 text-[11px] font-bold">1</Button>
              <Button variant="outline" className="w-8 h-8 rounded-xl bg-white dark:bg-transparent border-stone dark:border-[#2a2520] text-on_surface dark:text-[#e8eaf0] p-0 text-[11px] font-bold">2</Button>
              <Button variant="outline" className="w-8 h-8 rounded-xl bg-white dark:bg-transparent border-stone dark:border-[#2a2520] text-on_surface dark:text-[#e8eaf0] p-0 text-[11px] font-bold">3</Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl bg-white dark:bg-transparent border-stone dark:border-[#2a2520] text-on_surface_variant"><ChevronRight size={14} /></Button>
            </div>
          </div>
        </Card>

        {/* Bottom Banner Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">Immutable Proof</h3>
            </div>
            <p className="text-on_surface_variant dark:text-[#9ba3b8] text-sm leading-relaxed max-w-sm mb-6 font-medium">
              Every action in this history is cryptographically signed and hashed into the blockchain. Click any transaction hash to view full block data on the public explorer.
            </p>
            <a href="#" className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-[0.15em] hover:opacity-80 transition-opacity">
              Blockchain Audit Protocol <ArrowRight size={14} className="ml-1.5" />
            </a>
          </Card>

          <Card className="rounded-2xl border-none p-8 bg-secondary_fixed dark:bg-[#3d2800] overflow-hidden relative group">
            <div className="relative z-10 w-full md:max-w-[85%] h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-black/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-on_secondary_fixed" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-on_secondary_fixed">Smart Auditor Beta</h3>
                </div>
                <p className="text-on_secondary_fixed/80 text-sm leading-relaxed mb-8 font-medium">
                  Our AI engine has flagged <span className="font-bold underline decoration-2 underline-offset-4">2 events</span> that might require your manual verification this week.
                </p>
              </div>
              <Button className="bg-on_secondary_fixed text-secondary_fixed hover:opacity-90 border-none rounded-xl h-11 px-8 text-[10px] font-bold uppercase tracking-widest shadow-lg w-fit transition-transform active:scale-95">
                Go to Verification Queue
              </Button>
            </div>
            {/* abstract map shape decoration right side */}
            <div className="absolute right-[-5%] bottom-[-10%] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <svg width="240" height="240" viewBox="0 0 24 24" fill="currentColor" className="text-on_secondary_fixed">
                 <path d="M14.73 2.03L9.27 4.76V21.97L14.73 19.24V2.03ZM2 4.76V21.97L7.45 19.24V2.03L2 4.76ZM21.97 2.03L16.55 4.76V21.97L21.97 19.24V2.03Z"/>
               </svg>
            </div>
          </Card>
        </div>

      </div>
  );
}
