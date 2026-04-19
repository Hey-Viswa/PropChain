"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ClipboardList,
  Settings2,
  ListTodo,
} from "lucide-react";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useAdminRole } from "@/hooks/useAdminRole";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const { isOracleMode } = useOracleAccessStore();
  const { isOracle: hasOracleRole } = useAdminRole();
  const showOracleNav = isOracleMode || hasOracleRole;

  const items = showOracleNav
    ? [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Queue",     href: "/oracle/queue", icon: ListTodo },
        { label: "Users",     href: "/oracle/users", icon: Building2 },
        { label: "Settings",  href: "/oracle/settings", icon: Settings2 },
      ]
    : [
        { label: "Dashboard",   href: "/dashboard",  icon: LayoutDashboard },
        { label: "Properties",  href: "/properties", icon: Building2 },
        { label: "Mint",        href: "/mint/details", icon: PlusCircle },
        { label: "Audit",       href: "/audit",      icon: ClipboardList },
        { label: "Settings",    href: "/settings",   icon: Settings2 },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 dark:bg-[#0f0e0d]/95 border-t border-stone/50 dark:border-[#2a2520] backdrop-blur-xl">
      <div className="flex items-center justify-around px-1 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0))]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all min-w-0 active:scale-90",
                active
                  ? "text-primary dark:text-[#E89874]"
                  : "text-on_surface_variant/60 dark:text-[#6b6560] hover:text-on_surface dark:hover:text-[#9b9690]"
              )}
            >
              <Icon size={item.label === "Mint" ? 24 : 22} className={cn(
                item.label === "Mint" && "p-1 bg-primary text-on_primary rounded-xl shadow-sm",
                active && item.label !== "Mint" && "opacity-100"
              )} />
              <span className={cn(
                "text-[10px] font-bold tracking-tight uppercase",
                active ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
