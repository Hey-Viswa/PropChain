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
          "sticky top-0 z-40 h-16 flex items-center justify-between",
          "px-6 xl:px-8 2xl:px-10",
          "bg-surface_container_low/90 dark:bg-[#0d1117]/90 backdrop-blur-[12px]",
          "shadow-[0_12px_32px_rgba(0,26,67,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 min-w-0">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <ChevronRight size={13} className="text-on_surface_variant dark:text-[#6b7280] shrink-0" />
                )}
                <span
                  className={cn(
                    "text-label-sm truncate",
                    i === crumbs.length - 1
                      ? "text-on_surface dark:text-[#e8eaf0] font-medium"
                      : "text-on_surface_variant dark:text-[#6b7280]"
                  )}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>

        </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Network badge */}
        <div className="inline-flex items-center
                  transition-colors
                  bg-primary_fixed
                  dark:bg-[#1a2d4d]
                  text-primary
                  dark:text-[#6b9eff]
                  rounded-full text-xs
                  px-3 py-1 font-medium
                  hidden sm:flex">
          {chain?.name ?? "No Network"}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Wallet address */}
        {mounted && isConnected && (
          <span className="bg-surface_container
                     dark:bg-[#1c2333]
                     rounded-md px-3 py-1.5
                     text-sm font-mono
                     text-on_surface_variant
                     dark:text-[#9ba3b8]
                     hidden sm:inline">
            {truncatedAddress}
          </span>
        )}

        {/* Oracle Auth button component */}
        {mounted && <OracleAuthButton variant="navbar" />}

        {/* Role badge - shows ORACLE or USER */}
        {mounted && (
          <span className={`rounded-full text-xs
                       font-medium px-3 py-1
                       hidden sm:inline
                       ${isInOracleContext
                         ? "bg-primary_fixed dark:bg-[#1a2d4d] text-primary dark:text-[#6b9eff]"
                         : "bg-secondary_fixed text-on_secondary_fixed dark:bg-[#2a1800] dark:text-[#ffddb4]"
                       }`}>
            {isInOracleContext ? "ORACLE" : "USER"}
          </span>
        )}

        {/* Disconnect button */}
        {mounted && isConnected && (
          <button
            onClick={() => {
              disconnect();
              toast({
                title: "Wallet disconnected",
                description: "Your wallet has been disconnected.",
              });
            }}
            className="bg-surface_container
                 dark:bg-[#1c2333]
                 text-on_surface_variant
                 dark:text-[#9ba3b8]
                 rounded-md px-3 py-1.5 text-sm
                 font-medium
                 hover:bg-surface_container_high
                 dark:hover:bg-[#222b3d]
                 transition hidden sm:inline">
            Disconnect
          </button>
        )}

        {/* Connect wallet button */}
        {mounted && !isConnected && (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-primary text-on_primary
                 rounded-md px-4 py-1.5 text-sm
                 font-medium hover:opacity-90
                 transition cursor-pointer
                 disabled:opacity-50
                 disabled:cursor-not-allowed
                 hidden sm:inline">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {/* Clerk User Button */}
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
