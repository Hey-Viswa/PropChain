"use client";

import { ChevronRight, ShieldCheck, X } from "lucide-react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/shared/ThemeToggle";
import OracleAccessModal from "@/components/shared/OracleAccessModal";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useRouter } from "next/navigation";
import { useAdminRole } from "@/hooks/useAdminRole";

import { useRoleStore } from "@/store/useRoleStore";

export default function Navbar() {
  const router = useRouter();
  const crumbs = useBreadcrumbs();
  const { role } = useRoleStore();
  const { user, isLoaded } = useUser();
  const { isConnected, isConnecting, truncatedAddress, connect, disconnect, chain } = useWallet();
  const { isOracle: isOracleUser } = useAdminRole();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [showOracleModal, setShowOracleModal] =
    useState(false);
  const { isOracleMode, reset } =
    useOracleAccessStore();

  useEffect(() => {
    if (user) {
      console.log("Clerk user imageUrl:", user.imageUrl);
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOracleUser) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        setShowOracleModal(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOracleUser]);

  const walletSection = !mounted ? (
    <div className="w-32 h-8 bg-surface_container rounded-md animate-pulse" />
  ) : isConnected ? (
    <div className="flex items-center gap-2">
      <span className="bg-surface_container dark:bg-[#1c2333] rounded-md
                       px-3 py-1.5 text-sm font-mono
                       text-on_surface_variant dark:text-[#9ba3b8] hidden sm:inline">
        {truncatedAddress}
      </span>
      <button
        onClick={() => {
          disconnect();
          toast({
            title: "Wallet disconnected",
            description: "Your wallet has been disconnected.",
          });
        }}
        className="bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#c9cdd8]
                   rounded-md px-4 py-1.5 text-sm font-medium
                   hover:bg-surface_container_high dark:hover:bg-[#1c2333]
                   dark:hover:text-[#e8eaf0] transition
                   cursor-pointer hidden sm:inline">
        Disconnect
      </button>
    </div>
  ) : (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="bg-primary text-on_primary rounded-md
                 px-4 py-1.5 text-sm font-medium
                 hover:opacity-90 transition cursor-pointer
                 disabled:opacity-50
                 disabled:cursor-not-allowed
                 hidden sm:inline">
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );

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

          {isOracleMode ? (
            <button
              onClick={() => {
                reset();
                router.push("/dashboard");
              }}
              className="flex items-center gap-1.5
               text-label-sm font-medium
               text-primary dark:text-[#6b9eff]
               bg-primary_fixed
               dark:bg-[#1a2d4d]
               rounded-full px-3 py-1
               hover:opacity-80 transition-opacity">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Oracle Mode</span>
              <X className="w-3 h-3 ml-0.5" />
            </button>
          ) : isOracleUser ? (
            <button
              onClick={() => setShowOracleModal(true)}
              className="flex items-center gap-1.5
               text-label-sm font-medium
               text-on_surface_variant
               dark:text-[#9ba3b8]
               hover:text-primary
               dark:hover:text-[#6b9eff]
               transition-colors px-2 py-1
               rounded-lg
               hover:bg-surface_container
               dark:hover:bg-[#1c2333]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                Oracle Access
              </span>
            </button>
          ) : (
            <></>
          )}
        </div>

      {/* Right badges */}
      <div className="flex items-center gap-2.5 shrink-0 ml-4">
        {/* Network badge */}
        <div className="inline-flex items-center transition-colors
                bg-primary_fixed text-primary rounded-full
                dark:bg-[#1a2d4d] dark:text-[#6b9eff]
                text-xs px-3 py-1 font-medium">
          {chain?.name ?? "No Network"}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Wallet */}
        {walletSection}

        {/* Role */}
        <Badge className={cn(
          "rounded-full text-xs px-3 py-1 uppercase",
          role === "ORACLE"
            ? "bg-secondary_fixed text-on_secondary_fixed dark:bg-[#1a2d4d] dark:text-[#6b9eff]"
            : "bg-secondary_fixed text-on_secondary_fixed dark:bg-[#2a1a00] dark:text-[#ffddb4]"
        )}>
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

      {/* Oracle Modal */}
      <OracleAccessModal
        isOpen={showOracleModal}
        onClose={() => setShowOracleModal(false)}
      />
    </>
  );
}
