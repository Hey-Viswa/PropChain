"use client";

import { useState } from "react";
import { Shield, ShieldCheck, Lock, ChevronRight, Zap } from "lucide-react";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useAdminRole } from "@/hooks/useAdminRole";
import OracleAccessModal from "@/components/shared/OracleAccessModal";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * OracleAccessCard - Prominent card shown on dashboard for users with Oracle privileges
 * Makes it easy to enter Oracle mode with visual feedback
 */
export default function OracleAccessCard() {
  const { isOracleMode } = useOracleAccessStore();
  const { isOracle: hasOracleRole, isLoading } = useAdminRole();
  const [showModal, setShowModal] = useState(false);

  // Don't show if user doesn't have Oracle role
  if (!hasOracleRole || isLoading) return null;

  // Already in Oracle mode - show quick access
  if (isOracleMode) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary_container dark:from-[#1a2d4d] dark:to-[#0d1628] p-6 shadow-lg">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Oracle Mode Active
                </h3>
                <p className="text-sm text-white/80">
                  Government Authority Panel
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/oracle/queue"
                className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Verification Queue
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/oracle/users"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                User Monitoring
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-3 h-3 bg-success rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Not in Oracle mode - show access button
  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className={cn(
          "relative overflow-hidden rounded-2xl cursor-pointer group",
          "bg-surface_container_low dark:bg-[#131820]",
          "border-2 border-primary/20 dark:border-[#1a2d4d]",
          "hover:border-primary/40 dark:hover:border-[#2a4d7d]",
          "transition-all duration-300 ease-out",
          "hover:shadow-[0_8px_32px_rgba(0,80,178,0.12)]",
          "dark:hover:shadow-[0_8px_32px_rgba(107,158,255,0.1)]"
        )}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary_fixed dark:bg-[#1a2d4d] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-primary dark:text-[#6b9eff]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-headline-sm font-bold text-on_surface dark:text-[#e8eaf0]">
                    Oracle Portal
                  </h3>
                  <p className="text-body-sm text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">
                    Government Authority Access
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Verified Role", color: "text-success" },
                  { icon: Lock, label: "Secure Auth", color: "text-primary dark:text-[#6b9eff]" },
                  { icon: Zap, label: "Quick Access", color: "text-warning" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface_container dark:bg-[#1c2333] group-hover:bg-surface_container_high dark:group-hover:bg-[#242c3d] transition-colors"
                  >
                    <item.icon className={cn("w-5 h-5", item.color)} />
                    <span className="text-[11px] font-medium text-center text-on_surface_variant dark:text-[#9ba3b8]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action button */}
              <button
                className="w-full flex items-center justify-center gap-2 bg-primary text-on_primary rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98] group-hover:shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                Enter Oracle Mode
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Keyboard shortcut hint */}
              <p className="text-label-sm text-on_surface_variant/60 dark:text-[#9ba3b8]/50 text-center">
                Quick access:{" "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded">
                  Ctrl
                </kbd>
                {" + "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded">
                  Shift
                </kbd>
                {" + "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded">
                  O
                </kbd>
              </p>
            </div>
          </div>
        </div>
      </div>

      <OracleAccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
