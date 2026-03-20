"use client";

import { ChevronRight } from "lucide-react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";

import { useRoleStore } from "@/store/useRoleStore";

export default function Navbar() {
  const crumbs = useBreadcrumbs();
  const { role } = useRoleStore();
  const { user, isLoaded } = useUser();
  const { isConnected, truncatedAddress, connect } = useWallet();

  useEffect(() => {
    if (user) {
      console.log("Clerk user imageUrl:", user.imageUrl);
    }
  }, [user]);

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

        {/* Wallet */}
        {isConnected ? (
          <span className="bg-surface_container rounded-md px-3 py-1.5 text-xs font-mono text-on_surface_variant hidden sm:inline">
            {truncatedAddress}
          </span>
        ) : (
          <button
            onClick={connect}
            className="bg-primary text-on_primary rounded-md
                       px-4 py-1.5 text-sm font-medium
                       hover:opacity-90 transition cursor-pointer hidden sm:inline"
          >
            Connect Wallet
          </button>
        )}

        {/* Role */}
        <Badge className="bg-secondary_fixed text-on_secondary_fixed rounded-full text-xs px-3 py-1 uppercase">
          {role}
        </Badge>

        {/* Clerk User Button */}
        {isLoaded && user && (
          <UserButton
            showName={false}
            appearance={{
              elements: {
                avatarBox:
                  "w-8 h-8 rounded-full ring-2 ring-primary_fixed",
                avatarImage:
                  "w-8 h-8 rounded-full object-cover",
                userButtonTrigger:
                  "focus:shadow-none focus:outline-none",
                userButtonPopoverCard:
                  "shadow-[0_12px_32px_rgba(0,26,67,0.06)] rounded-xl border-0",
                userButtonPopoverActionButton:
                  "hover:bg-surface_container_low rounded-lg",
                userButtonPopoverActionButtonText:
                  "text-on_surface text-sm",
                userButtonPopoverFooter:
                  "hidden",
              },
            }}
          />
        )}
      </div>
    </header>
  );
}
