"use client";

import { ChevronRight, ShieldCheck, X } from "lucide-react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/shared/ThemeToggle";
import OracleAccessModal from "@/components/shared/OracleAccessModal";
import { PropChainMark } from "@/components/shared/PropChainMark";
import OracleAuthButton from "@/components/shared/OracleAuthButton";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useRouter } from "next/navigation";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function Navbar() {
  const router = useRouter();
  const crumbs = useBreadcrumbs();
  const { user, isLoaded } = useUser();
  const { isConnected, isConnecting, truncatedAddress, connect, disconnect, chain } = useWallet();
  const { isOracle: hasOracleRole } = useAdminRole();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [showOracleModal, setShowOracleModal] =
    useState(false);
  const { isOracleMode, reset } =
    useOracleAccessStore();
  const isInOracleContext =
    isOracleMode || hasOracleRole;

  useEffect(() => {
    if (user) {
      console.log("Clerk user imageUrl:", user.imageUrl);
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toUpperCase() === "O" &&
        !isInOracleContext
      ) {
        e.preventDefault();
        setShowOracleModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInOracleContext]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[52px] flex items-center justify-between",
          "px-4 sm:px-6 md:px-7",
          "bg-cream/90 dark:bg-[#0f0e0d]/90 backdrop-blur-[10px]",
          "border-b border-stone dark:border-[#2a2520]"
        )}
      >
        {/* Mobile logo (visible only when sidebar is hidden) */}
        <div className="md:hidden flex items-center gap-2 mr-3 flex-shrink-0">
          <PropChainMark size={22} />
          <span className="font-display text-[14px] text-on_surface dark:text-[#e8e6e2] tracking-tight">
            Prop<span className="text-primary">Chain</span>
          </span>
        </div>

        {/* Breadcrumbs — desktop */}
        <nav className="hidden md:flex items-center gap-1.5 min-w-0">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span className="text-pebble dark:text-[#6b6560] text-[13px] shrink-0">/</span>
              )}
              <span
                className={cn(
                  "text-[13px] truncate",
                  i === crumbs.length - 1
                    ? "text-on_surface dark:text-[#e8e6e2] font-semibold"
                    : "text-on_surface_variant/60 dark:text-[#6b6560]"
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        {/* Spacer so right-side items push to the right on mobile */}
        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Network */}
          <div className="hidden sm:flex items-center px-[10px] py-1 rounded-full border border-stone dark:border-[#2a2520] text-[11px] font-medium text-on_surface_variant dark:text-[#9b9690]">
            {chain?.name ?? "No Network"}
          </div>

          {/* Wallet address */}
          {mounted && isConnected && (
            <span className="hidden sm:inline bg-sand dark:bg-[#1a1916] border border-stone dark:border-[#2a2520] rounded-[6px] px-[9px] py-1 text-[10px] font-mono text-on_surface_variant dark:text-[#9b9690]">
              {truncatedAddress}
            </span>
          )}

          {/* Oracle mode button */}
          {mounted && <OracleAuthButton variant="navbar" />}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Clerk avatar */}
          {isLoaded && user && <UserButton />}
        </div>
      </header>

      <OracleAccessModal
        isOpen={showOracleModal}
        onClose={() => setShowOracleModal(false)}
      />
    </>
  );
}
