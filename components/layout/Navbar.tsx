"use client";

import { ChevronRight, ShieldCheck, ShieldAlert } from "lucide-react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/useRoleStore";
import { useKYC } from "@/hooks/useKYC";
import { useAccount } from "wagmi";

export default function Navbar() {
  const crumbs = useBreadcrumbs();
  const { role } = useRoleStore();
  const { kycVerified, loading: kycLoading } = useKYC();
  const { address, isConnected } = useAccount();

  const walletDisplay = isConnected && address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 flex items-center justify-between",
        "px-6 xl:px-8 2xl:px-10",
        "bg-surface_container_low/80 backdrop-blur-[12px]",
        "shadow-[0_12px_32px_rgba(0,26,67,0.06)]"
      )}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && (
              <ChevronRight size={13} className="text-on_surface_variant shrink-0" />
            )}
            <span
              className={cn(
                "text-label-sm truncate",
                i === crumbs.length - 1
                  ? "text-on_surface font-medium"
                  : "text-on_surface_variant"
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right badges */}
      <div className="flex items-center gap-2.5 shrink-0 ml-4">
        {/* Network */}
        <Badge className="bg-primary_fixed text-primary rounded-full text-xs px-3 py-1 font-medium">
          Polygon Mumbai
        </Badge>

        {/* KYC status */}
        {kycLoading ? (
          <Skeleton className="h-6 w-20 rounded-full" />
        ) : (
          <Badge
            className={cn(
              "rounded-full text-xs px-3 py-1 flex items-center gap-1",
              kycVerified
                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
            )}
          >
            {kycVerified ? (
              <><ShieldCheck size={12} /> KYC Verified</>
            ) : (
              <><ShieldAlert size={12} /> KYC Pending</>
            )}
          </Badge>
        )}

        {/* Wallet address */}
        {walletDisplay && (
          <span className="bg-surface_container rounded-md px-3 py-1.5 text-xs font-mono text-on_surface_variant hidden sm:inline">
            {walletDisplay}
          </span>
        )}

        {/* Role */}
        <Badge className="bg-secondary_fixed text-on_secondary_fixed rounded-full text-xs px-3 py-1 uppercase">
          {role}
        </Badge>
      </div>
    </header>
  );
}
