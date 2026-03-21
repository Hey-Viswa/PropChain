"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import OracleAuthButton from "@/components/shared/OracleAuthButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ClipboardList,
  BarChart,
  ListTodo,
  Users,
  Globe,
  Shield,
  ShieldCheck,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  accent?: boolean;
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

const userNavGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Mint Asset", href: "/mint/details", icon: PlusCircle, accent: true },
      { label: "My Properties", href: "/properties", icon: Building2 },
    ]
  },
  {
    label: "Records",
    items: [
      { label: "Audit History", href: "/audit", icon: ClipboardList },
      { label: "Public Registry", href: "/registry", icon: Globe },
    ]
  }
];

const oracleNavGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Verification Queue", href: "/oracle/queue", icon: ListTodo },
      { label: "User Monitoring", href: "/oracle/users", icon: Users },
    ]
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics", href: "/oracle/analytics", icon: BarChart },
      { label: "Audit History", href: "/audit", icon: ClipboardList },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOracle: hasOracleRole, isLoading } = useAdminRole();
  const { isOracleMode } = useOracleAccessStore();
  const { isConnected, truncatedAddress } = useWallet();

  const showOracleNav = isOracleMode || hasOracleRole;

  const navGroups = showOracleNav ? oracleNavGroups : userNavGroups;

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    // Exact match for /mint vs /mint/* if needed, but simple startswith is usually fine
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[240px] xl:w-[260px] 2xl:w-[280px]
           flex-shrink-0 flex flex-col h-full
           bg-surface_container_low
           dark:bg-[#0d1117]">
      {/* Logo */}
      <Link href="/dashboard" className="dark:hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-2 flex-shrink-0 px-4 xl:px-5 pt-6 pb-4 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
            <span className="text-white font-bold text-sm font-display">P</span>
          </div>
          <span className="font-display font-bold text-xl text-on_surface dark:text-[#e8eaf0] tracking-tight whitespace-nowrap">
            Prop<span className="text-primary dark:text-[#6b9eff]">Chain</span>
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 xl:px-4 pb-4 overflow-y-auto flex flex-col gap-1">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
            <Skeleton className="h-9 w-full rounded-lg bg-surface_container" />
          </div>
        ) : (
          <>
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-1">
                {group.label && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant/50 dark:text-[#6b7280] px-3 mb-1 mt-4">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 xl:py-3 rounded-lg transition-all duration-150 ease-out w-full",
                         active
                           ? "bg-primary_fixed dark:bg-[#1a2d4d] text-primary dark:text-[#6b9eff] font-medium border-l-2 border-primary dark:border-[#6b9eff]"
                           : item.accent
                             ? "text-primary dark:text-[#6b9eff] hover:bg-primary_fixed/60 dark:hover:bg-[#1a2d4d] font-medium border-l-2 border-transparent"
                             : "text-on_surface_variant dark:text-[#c9cdd8] hover:bg-surface_container dark:hover:bg-[#1c2333] hover:text-on_surface dark:hover:text-[#e8eaf0] border-l-2 border-transparent"
                      )}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Settings at the bottom of the nav spacer */}
            {(() => {
              const bottomNavItem = showOracleNav
                ? { label: "Oracle Settings", href: "/oracle/settings", icon: SlidersHorizontal }
                : { label: "Settings", href: "/settings", icon: Settings2 };
              const Icon = bottomNavItem.icon;
              const active = isActive(bottomNavItem.href);
              return (
                <Link
                  href={bottomNavItem.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 xl:py-3 rounded-lg w-full mt-auto",
                    "transition-all duration-150 ease-out",
                    active
                      ? "bg-primary_fixed dark:bg-[#1a2d4d] text-primary dark:text-[#6b9eff] font-medium border-l-2 border-primary dark:border-[#6b9eff]"
                      : "text-on_surface_variant dark:text-[#c9cdd8] hover:bg-surface_container dark:hover:bg-[#1c2333] hover:text-on_surface dark:hover:text-[#e8eaf0] border-l-2 border-transparent"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{bottomNavItem.label}</span>
                </Link>
              );
            })()}

            {/* Oracle mode switch / exit */}
            {hasOracleRole && !isOracleMode && (
              <div className="px-0 pt-2">
                <Link
                  href="/oracle/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary dark:text-[#6b9eff] hover:bg-primary_fixed dark:hover:bg-[#1a2d4d] transition-colors text-sm font-medium border-l-2 border-transparent hover:border-primary dark:hover:border-[#6b9eff]"
                >
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  Switch to Oracle
                </Link>
              </div>
            )}
            
            {(isOracleMode || hasOracleRole) && isOracleMode && (
              <div className="px-0 pt-2">
                <OracleAuthButton variant="sidebar" />
              </div>
            )}
          </>
        )}
      </nav>

      {/* Role Toggle & Wallet strip */}
      <div className="px-3 xl:px-4 py-4 xl:py-5 border-t border-outline_variant/20 space-y-4 dark:bg-[#161b27]">
        <div className="flex items-center gap-2.5 px-3 py-2.5
                rounded-lg bg-surface_container dark:bg-[#1c2333]">
          <span className={`relative flex h-2 w-2 shrink-0`}>
            <span className={`relative inline-flex rounded-full
                      h-2 w-2 ${isConnected
                        ? "bg-success"
                        : "bg-error"}`} />
          </span>
          <span className="font-mono text-label-sm
                   text-on_surface_variant dark:text-[#9ba3b8] truncate">
            {isConnected ? truncatedAddress : "Not connected"}
          </span>
        </div>

        {(isOracleMode || hasOracleRole) && (
          <div className="px-3">
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
