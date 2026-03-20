"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/store/useRoleStore";
import { useIsOracle } from "@/hooks/useIsOracle";
import { useWallet } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ClipboardList,
  BarChart,
  ListTodo,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  accent?: boolean;
};

const userNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Properties", href: "/properties", icon: Building2 },
  { label: "Mint Asset", href: "/mint", icon: PlusCircle, accent: true },
  { label: "Audit History", href: "/audit", icon: ClipboardList },
  { label: "Public Registry", href: "/registry", icon: Globe },
];

const oracleNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Verification Queue", href: "/oracle/queue", icon: ListTodo },
  { label: "Analytics", href: "/oracle/analytics", icon: BarChart },
  { label: "Audit History", href: "/audit", icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOracle, isLoading } = useIsOracle();
  const { isConnected, truncatedAddress } = useWallet();

  const navItems = isOracle ? oracleNavItems : userNavItems;

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    // Exact match for /mint vs /mint/* if needed, but simple startswith is usually fine
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[240px] xl:w-[260px] 2xl:w-[280px] flex-shrink-0 flex flex-col h-full bg-surface_container_low">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 xl:px-5 pt-6 pb-4 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <span className="text-white font-bold text-sm font-display">P</span>
        </div>
        <span className="font-display font-bold text-xl text-on_surface tracking-tight">
          Prop<span className="text-primary">Chain</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 xl:px-4 space-y-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-2 px-3">
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
          </div>
        )}
        {!isLoading && navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 xl:py-3 rounded-lg transition-colors text-body-md w-full",
                active
                  ? "bg-primary_fixed text-primary font-medium"
                  : item.accent
                    ? "text-primary hover:bg-primary_fixed/60 font-medium"
                    : "text-on_surface_variant hover:bg-surface_container hover:text-on_surface"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0",
                  active || item.accent ? "text-primary" : "text-on_surface_variant"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Toggle & Wallet strip */}
      <div className="mt-auto px-3 xl:px-4 py-4 xl:py-5 border-t border-outline_variant/20 space-y-4">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface_container">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-success' : 'bg-error'}`} />
            </span>
            <span className="font-mono text-label-sm text-on_surface_variant truncate">
              {isConnected ? truncatedAddress : "Not connected"}
            </span>
          </div>
        </div>

        {isOracle && (
          <div className="px-3 mt-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary_fixed rounded-lg">
              <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-label-sm font-medium text-on_secondary_fixed">
                Oracle Node Active
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
