"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { PropChainMark } from "@/components/shared/PropChainMark";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import Link from "next/link";

export default function Navbar() {
  const crumbs = useBreadcrumbs();
  const { isConnected, truncatedAddress, chain } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[60px] flex items-center justify-between",
        "px-4 sm:px-6 md:px-8",
        "bg-cream/90 dark:bg-[#0f0e0d]/90 backdrop-blur-[12px]",
        "border-b border-stone/50 dark:border-white/5"
      )}
    >
      {/* Mobile logo (visible only when sidebar is hidden) */}
      <div className="md:hidden flex items-center gap-2 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <PropChainMark size={24} />
          <span className="font-display text-[15px] text-on_surface dark:text-[#e8e6e2] tracking-tight font-bold">
            Prop<span className="text-primary">Chain</span>
          </span>
        </Link>
      </div>

      {/* Breadcrumbs — desktop */}
      <nav className="hidden md:flex items-center gap-2 min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && (
              <span className="text-stone dark:text-white/10 text-[13px] shrink-0">/</span>
            )}
            <span
              className={cn(
                "text-[12px] font-black uppercase tracking-widest truncate",
                i === crumbs.length - 1
                  ? "text-primary dark:text-[#E89874]"
                  : "text-on_surface_variant/40 dark:text-muted-foreground/30"
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Network & Wallet status — institutional pill */}
        {mounted && isConnected && (
          <div className="flex items-center gap-3 bg-sand/50 dark:bg-white/5 px-4 py-1.5 rounded-full border border-stone/30 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-1.5 pr-3 border-r border-stone/30 dark:border-white/10">
               <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-on_surface/60 dark:text-[#e8eaf0]/60">
                 {chain?.name || "Mainnet"}
               </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-primary dark:text-[#E89874]">
              {truncatedAddress}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
