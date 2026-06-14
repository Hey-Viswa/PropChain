"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { PropChainMark } from "@/components/shared/PropChainMark";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "@/components/shared/ThemeToggle";
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
  ShieldCheck,
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
  const { user, isLoaded: userLoaded } = useUser();
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
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-full bg-sand dark:bg-[#0d0c0b] border-r border-stone/50 dark:border-white/5">

      {/* Logo */}
      <Link href="/" className="transition-opacity hover:opacity-80">
        <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
          <PropChainMark size={28} />
          <span className="font-display text-[18px] text-on_surface dark:text-[#e8e6e2] tracking-tight whitespace-nowrap font-bold">
            Prop<span className="text-primary dark:text-[#E89874]">Chain</span>
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto flex flex-col gap-1 mt-4">
        {isLoading ? (
          <div className="space-y-2 px-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {navGroups.map((group, gi) => (
              <div key={gi} className={cn("flex flex-col gap-0.5", gi > 0 && "mt-6")}>
                {group.label && (
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on_surface_variant/40 dark:text-muted-foreground/30 px-3 mb-2">
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
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-[13px] font-bold uppercase tracking-widest group",
                        active
                          ? "bg-white dark:bg-card text-primary dark:text-[#E89874] shadow-sm border border-stone/30 dark:border-white/5"
                          : "text-on_surface_variant/60 dark:text-muted-foreground/60 hover:bg-white/50 dark:hover:bg-card/50 hover:text-on_surface dark:hover:text-[#e8e6e2]"
                      )}
                    >
                      <Icon size={16} className={cn("shrink-0", active ? "text-primary" : "opacity-40 group-hover:opacity-100")} />
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on_surface_variant/60 dark:text-muted-foreground/60 hover:bg-primary/5 hover:text-primary transition-all text-[12px] font-bold uppercase tracking-widest mt-4"
              >
                <Shield size={16} className="shrink-0" />
                <span>Oracle Login</span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* ── Footer area ── */}
      <div className="p-3 space-y-2 mt-auto border-t border-stone/30 dark:border-white/5 bg-sand/50 dark:bg-card/30">

        {/* Oracle active pill + exit */}
        {isOracleMode && (
          <button
            onClick={reset}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary text-on_primary shadow-lg transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Oracle Active</span>
            </div>
            <LogOut size={12} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Settings */}
        <Link
          href={settingsItem.href}
          prefetch={true}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[12px] font-bold uppercase tracking-widest transition-all",
            isActive(settingsItem.href)
              ? "bg-white dark:bg-card text-primary dark:text-[#E89874] shadow-sm border border-stone/30 dark:border-white/5"
              : "text-on_surface_variant/60 dark:text-muted-foreground/60 hover:bg-white/50 dark:hover:bg-card/50"
          )}
        >
          <settingsItem.icon size={16} className="shrink-0" />
          <span>{settingsItem.label}</span>
        </Link>

        {/* Identity & Theme controls */}
        <div className="flex items-center justify-between gap-2 p-2 bg-white/40 dark:bg-white/5 rounded-2xl border border-stone/20 dark:border-white/5">
          <div className="flex items-center gap-2 min-w-0">
             <div className="shrink-0 scale-90 origin-left">
               <UserButton />
             </div>
             <div className="min-w-0 overflow-hidden">
               <p className="text-[10px] font-black uppercase text-on_surface dark:text-[#e8eaf0] truncate">
                 {user?.firstName || "Identity"}
               </p>
               <div className="flex items-center gap-1">
                  <div className={cn("w-1 h-1 rounded-full", isConnected ? "bg-success" : "bg-error")} />
                  <p className="text-[9px] font-mono text-on_surface_variant/60 dark:text-muted-foreground/60 truncate">
                    {isConnected ? truncatedAddress : "Offline"}
                  </p>
               </div>
             </div>
          </div>
          <div className="shrink-0 h-8 w-8 flex items-center justify-center border-l border-stone/20 dark:border-white/5 pl-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Dev oracle toggle */}
        {isDev && !isOracleMode && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone/5 dark:bg-black/20 border border-dashed border-stone/50 dark:border-white/5 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black text-on_surface_variant/60 uppercase tracking-widest">Dev Mode</span>
            <Switch
              checked={isOracleMode}
              onCheckedChange={(v) => v ? setOracleMode(true) : reset()}
              className="scale-[0.6] origin-right"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
