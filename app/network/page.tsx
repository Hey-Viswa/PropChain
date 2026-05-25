import {
  Activity, Cpu, Globe, Zap,
  Server, TrendingUp, CheckCircle2, Clock,
} from "lucide-react";

const NETWORK_STATS = [
  { label: "Total Value Locked",   value: "$0", delta: "0%", icon: TrendingUp,  color: "text-success" },
  { label: "Properties On-Chain",  value: "0",  delta: "0 today", icon: Globe,   color: "text-primary" },
  { label: "Avg. Block Time",      value: "0s", delta: "0", icon: Clock,   color: "text-muted-foreground" },
  { label: "Oracle Nodes Active",  value: "0",  delta: "0% up", icon: Server,  color: "text-success" },
];

const RECENT_BLOCKS: Array<{ block: string; txns: number; time: string; size: string }> = [];

const NODES: Array<{ region: string; count: number; latency: string; status: "optimal" | "degraded" }> = [];

export default function NetworkPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">

      {/* Header */}
      <div className="pt-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-6 bg-primary" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Network Data</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2">
          Network Status
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          Protocol metrics and infrastructure health (awaiting data).
        </p>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 -mt-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase">Awaiting telemetry</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NETWORK_STATS.map(({ label, value, delta, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-card">
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 ${color}`}>
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground tracking-wide">{delta}</span>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column: blocks + nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Blocks */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Cpu size={15} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Recent Blocks</h2>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Ethereum L2</span>
          </div>
          <div className="divide-y divide-border">
            {RECENT_BLOCKS.length === 0 ? (
              <div className="px-6 py-6 text-center text-[11px] text-muted-foreground">
                No blocks yet
              </div>
            ) : (
              RECENT_BLOCKS.map(({ block, txns, time, size }) => (
                <div key={block} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-[12px] font-bold text-primary font-mono">{block}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{txns} txns · {size}</p>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Node Distribution */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Oracle Node Distribution</h2>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">0 nodes</span>
          </div>
          <div className="divide-y divide-border">
            {NODES.length === 0 ? (
              <div className="px-6 py-6 text-center text-[11px] text-muted-foreground">
                No node telemetry yet
              </div>
            ) : (
              NODES.map(({ region, count, latency, status }) => (
                <div key={region} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === "optimal" ? "bg-success" : "bg-warning"}`} />
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{region}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{count} nodes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-foreground font-mono">{latency}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${status === "optimal" ? "text-success" : "text-warning"}`}>
                      {status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Protocol health bar */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap size={15} className="text-primary" />
            Protocol Health — Last 90 Days
          </h2>
          <span className="text-[11px] font-bold text-muted-foreground">0% uptime</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 90 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-8 rounded-sm bg-stone/20 dark:bg-[#2a2520]"
              title="No data"
            />
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-[10px] text-muted-foreground">90 days ago</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-sm bg-stone/20 inline-block" /> No data
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
      </div>

    </div>
  );
}
