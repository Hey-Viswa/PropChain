"use client";

import { BarChart3, PieChart, Activity, TrendingUp } from "lucide-react";

export default function OracleAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Network Analytics
          </h1>
          <p className="text-body-md text-on_surface_variant">
            Top-level oracle metrics and validator distribution across the protocol.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Activity size={20} />, label: "Total TVL Validated", value: "$4.2B", color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
          { icon: <TrendingUp size={20} />, label: "Current Yield Avg", value: "7.2%", color: "text-success", bg: "bg-success/10" },
          { icon: <BarChart3 size={20} />, label: "Total Transactions", value: "842k", color: "text-primary", bg: "bg-primary/10" },
          { icon: <PieChart size={20} />, label: "Active Nodes", value: "128", color: "text-[#d97706]", bg: "bg-[#d97706]/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface_container_lowest rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] uppercase font-bold text-on_surface_variant mb-1">{stat.label}</p>
            <p className="text-2xl font-bold font-display text-on_surface">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface_container_lowest rounded-2xl p-12 text-center border border-dashed border-outline/30 flex flex-col items-center">
         <BarChart3 className="w-12 h-12 text-on_surface_variant/40 mb-4" />
         <h3 className="text-xl font-semibold mb-2 text-on_surface">Interactive Charts Coming Soon</h3>
         <p className="text-on_surface_variant max-w-sm">Detailed validator analytics and consensus graphs are planned for the next implementation phase.</p>
       </div>
    </div>
  );
}
