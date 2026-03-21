"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp } from "lucide-react";
import OracleGuard from "@/components/shared/OracleGuard";
import {
  MOCK_SUBMISSIONS_OVER_TIME,
  MOCK_VERIFICATION_OUTCOMES,
  MOCK_RECENT_ORACLE_ACTIVITY
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.ResponsiveContainer })),
  {
    ssr: false,
    loading: () => <div className="h-60 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-shimmer" />,
  }
);

const AreaChart = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.AreaChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 bg-surface_container
                      rounded-xl animate-pulse" />
    ),
  }
);

const Area = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Area })),
  { ssr: false }
);

const XAxis = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.XAxis })),
  { ssr: false }
);

const YAxis = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.YAxis })),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.CartesianGrid })),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Tooltip })),
  { ssr: false }
);

const PieChart = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.PieChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-surface_container
                      rounded-xl animate-pulse" />
    ),
  }
);

const Pie = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Pie })),
  { ssr: false }
);

const Cell = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Cell })),
  { ssr: false }
);

const Legend = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.Legend })),
  { ssr: false }
);

export default function OracleAnalyticsPage() {
  return (
    <OracleGuard>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Network Analytics
          </h1>
          <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
            Top-level oracle metrics and validator distribution across the protocol.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Activity size={20} />, label: "Total TVL Validated", value: "$4.2B", color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
          { icon: <TrendingUp size={20} />, label: "Current Yield Avg", value: "7.2%", color: "text-success", bg: "bg-success/10" },
          { icon: <BarChart3 size={20} />, label: "Total Transactions", value: "842k", color: "text-primary", bg: "bg-primary/10" },
          { icon: <PieChartIcon size={20} />, label: "Active Nodes", value: "128", color: "text-[#d97706]", bg: "bg-[#d97706]/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] uppercase font-bold text-on_surface_variant dark:text-[#9ba3b8] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row — two columns */}
      <Suspense fallback={<div className="h-48 bg-surface_container dark:bg-[#1c2333] rounded-xl animate-shimmer" />}>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_380px] gap-4 xl:gap-6">
        
          {/* Left: Area chart */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6">
            <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0] mb-1">
              Submissions Over Time
            </p>
            <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mb-5">
              Last 7 days
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MOCK_SUBMISSIONS_OVER_TIME}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0050b2" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0050b2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="rejectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ba1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#c3c6cf" strokeOpacity={0.3} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 12px 32px rgba(0,26,67,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="approved" stroke="#0050b2" strokeWidth={2} fill="url(#approvedGrad)" name="Approved" />
                <Area type="monotone" dataKey="rejected" stroke="#ba1a1a" strokeWidth={2} fill="url(#rejectedGrad)" name="Rejected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        
          {/* Right: Donut chart */}
          <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6 flex flex-col relative">
            <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0] mb-1">
              Verification Outcomes
            </p>
            <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mb-4">
              All time
            </p>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={MOCK_VERIFICATION_OUTCOMES}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {MOCK_VERIFICATION_OUTCOMES.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 12px 32px rgba(0,26,67,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: '#43474e', fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label — absolute positioned */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                <p className="text-center text-label-sm text-on_surface_variant dark:text-[#9ba3b8] w-24">
                  83% Approval Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
      
      {/* Recent Oracle Activity table */}
      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6 mt-4 xl:mt-6">
        <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0] mb-4">
          Recent Oracle Activity
        </p>
        <div className="space-y-3">
          {MOCK_RECENT_ORACLE_ACTIVITY.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  entry.action === 'APPROVE' ? 'bg-success' : 'bg-error'
                )} />
                <span className="text-body-md font-mono text-on_surface_variant dark:text-[#9ba3b8]">
                  {entry.ulpin}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-body-md font-medium",
                  entry.action === 'APPROVE' 
                    ? 'text-success' : 'text-error'
                )}>
                  {entry.decision}
                </span>
                <span className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">
                  {entry.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </OracleGuard>
  );
}
