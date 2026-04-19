"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { PropChainMark } from "@/components/shared/PropChainMark";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
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
  Settings2,
  SlidersHorizontal,
  LogOut,
  FlaskConical,
} from "lucide-react";

const isDev = process.env.NODE_ENV === "development";

type NavItem  = { label: string; href: string; icon: any };
type NavGroup = { label?: string; items: NavItem[] };

const userNavGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard",       href: "/dashboard",    icon: LayoutDashboard },
      { label: "Mint Asset",      href: "/mint/details", icon: PlusCircle },
      { label: "My Properties",   href: "/properties",   icon: Building2 },
    ],
  },
  {
    label: "Records",
    items: [
      { label: "Audit History",   href: "/audit",        icon: ClipboardList },
      { label: "Public Registry", href: "/registry",     icon: Globe },
    ],
  },
];

const oracleNavGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard",           href: "/dashboard",        icon: LayoutDashboard },
      { label: "Verification Queue",  href: "/oracle/queue",     icon: ListTodo },
      { label: "User Monitoring",     href: "/oracle/users",     icon: Users },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics",    href: "/oracle/analytics", icon: BarChart },
      { label: "Audit History",href: "/audit",            icon: ClipboardList },
    ],
  },
];

export default function Sidebar() {
  const pathname         = usePathname();
  const { isOracle: hasOracleRole, isLoading } = useAdminRole();
  const { isOracleMode, setOracleMode, reset } = useOracleAccessStore();
  const { isConnected, truncatedAddress } = useWallet();

  const showOracleNav = isOracleMode || hasOracleRole;
  const navGroups     = showOracleNav ? oracleNavGroups : userNavGroups;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const settingsItem = showOracleNav
    ? { label: "Oracle Settings", href: "/oracle/settings", icon: SlidersHorizontal }
    : { label: "Settings",        href: "/settings",        icon: Settings2 };

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-full bg-sand dark:bg-[#0d0c0b] border-r border-stone dark:border-[#2a2520]">

      {/* Logo */}
      <Link href="/dashboard" className="transition-opacity hover:opacity-80">
        <div className="flex items-center gap-2.5 px-[18px] pt-[22px] pb-[18px]">
          <PropChainMark size={26} />
          <span className="font-display text-[17px] text-on_surface dark:text-[#e8e6e2] tracking-tight whitespace-nowrap">
            Prop<span className="text-primary">Chain</span>
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-2 overflow-y-auto flex flex-col gap-[1px]">
        {isLoading ? (
          <div className="space-y-1 px-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-[7px] bg-stone" />
            ))}
          </div>
        ) : (
          <>
            {navGroups.map((group, gi) => (
              <div key={gi} className={cn("flex flex-col gap-[1px]", gi > 0 && "mt-4")}>
                {group.label && (
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-on_surface_variant/40 dark:text-[#6b6560] px-[10px] mb-1 mt-1.5">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon   = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className={cn(
                        "flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] transition-all duration-150 w-full text-[13px]",
                        active
                          ? "bg-white dark:bg-[#211f1c] text-primary dark:text-[#E89874] font-semibold shadow-sm"
                          : "text-[#8a8480] dark:text-[#7a7470] hover:bg-white/70 dark:hover:bg-[#211f1c] hover:text-on_surface dark:hover:text-[#e8e6e2] font-normal"
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            <div className="flex-1" />

            {/* Switch to Oracle (real role, not yet in oracle mode) */}
            {hasOracleRole && !isOracleMode && (
              <Link
                href="/oracle/login"
                className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-[#8a8480] dark:text-[#7a7470] hover:bg-white/70 hover:text-primary dark:hover:bg-[#211f1c] dark:hover:text-[#E89874] transition-colors text-[13px] font-normal mt-1"
              >
                <Shield size={15} className="shrink-0" />
                <span>Switch to Oracle</span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* ── Footer area ── */}
      <div className="px-2 pb-2 pt-1 space-y-1.5">

        {/* Settings at the bottom */}
        <Link
          href={settingsItem.href}
          prefetch={true}
          className={cn(
            "flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] w-full text-[13px] transition-all duration-150",
            isActive(settingsItem.href)
              ? "bg-white dark:bg-[#211f1c] text-primary dark:text-[#E89874] font-semibold shadow-sm"
              : "text-[#8a8480] dark:text-[#7a7470] hover:bg-white/70 dark:hover:bg-[#211f1c] hover:text-on_surface dark:hover:text-[#e8e6e2]"
          )}
        >
          <settingsItem.icon size={15} className="shrink-0" />
          <span>{settingsItem.label}</span>
        </Link>

        {/* Oracle active pill + exit */}
        {isOracleMode && (
          <button
            onClick={reset}
            className="w-full flex items-center justify-between px-[10px] py-2 rounded-[7px] bg-primary_fixed dark:bg-[#3D1F10] group hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-primary shrink-0" />
              <span className="text-[11px] font-semibold text-primary dark:text-[#E89874]">Oracle Active</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <LogOut size={11} className="text-primary dark:text-[#E89874]" />
              <span className="text-[10px] text-primary dark:text-[#E89874]">Exit</span>
            </div>
          </button>
        )}

        {/* Dev oracle toggle */}
        {isDev && (
          <div className="flex items-center justify-between px-[10px] py-1.5 rounded-[7px] border border-dashed border-stone dark:border-[#2a2520]">
            <div className="flex items-center gap-1.5">
              <FlaskConical size={11} className="text-[#8a8480] shrink-0" />
              <span className="text-[9px] font-bold text-[#8a8480] dark:text-[#7a7470] uppercase tracking-wider">Dev Oracle</span>
            </div>
            <Switch
              checked={isOracleMode}
              onCheckedChange={(v) => v ? setOracleMode(true) : reset()}
              className="scale-[0.7] origin-right"
            />
          </div>
        )}

        {/* Wallet strip */}
        <div className="flex items-center gap-2 px-[10px] py-[7px] bg-white dark:bg-[#1a1916] rounded-[7px] border border-stone dark:border-[#2a2520]">
          <span className={cn(
            "h-[6px] w-[6px] rounded-full shrink-0",
            isConnected ? "bg-success" : "bg-error"
          )} />
          <span className="font-mono text-[10px] text-on_surface_variant dark:text-[#9b9690] truncate">
            {isConnected ? truncatedAddress : "Not connected"}
          </span>
        </div>
      </div>
    </aside>
  );
}
