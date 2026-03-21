"use client";
import { useOracleAccessStore }
  from "@/store/useOracleAccessStore";
import { useAdminRole }
  from "@/hooks/useAdminRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, ShieldCheck } from "lucide-react";
import OracleAuthButton from "@/components/shared/OracleAuthButton";

export default function OracleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isOracleMode } = useOracleAccessStore();
  const { isOracle, isLoading } = useAdminRole();
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // FAST PATH: if oracle mode is active via Zustand
  // show content immediately - no DB check needed
  if (isOracleMode) {
    return <>{children}</>;
  }

  // Wait for mount and DB check
  if (!mounted || isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-8 w-64
                        bg-surface_container
                        dark:bg-[#1c2333]
                        rounded-lg" />
        <div className="grid grid-cols-2
                        md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}
                 className="bg-surface_container_lowest
                             dark:bg-[#131820]
                             rounded-xl p-5 space-y-3">
              <div className="h-4 w-20
                              bg-surface_container
                              dark:bg-[#1c2333]
                              rounded" />
              <div className="h-8 w-16
                              bg-surface_container
                              dark:bg-[#1c2333]
                              rounded" />
            </div>
          ))}
        </div>
        <div className="bg-surface_container_lowest
                        dark:bg-[#131820]
                        rounded-2xl p-6 space-y-4">
          <div className="h-6 w-40
                          bg-surface_container
                          dark:bg-[#1c2333]
                          rounded" />
          <div className="h-48
                          bg-surface_container
                          dark:bg-[#1c2333]
                          rounded-xl" />
        </div>
      </div>
    );
  }

  // DB role check passed - show content
  if (isOracle) {
    return <>{children}</>;
  }

  // Access denied - show inline activation UI
  if (isLoading) {
    return (
      <>
        <div className="flex flex-col items-center
                      justify-center min-h-[60vh]
                      gap-6">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl
                        bg-primary_fixed
                        dark:bg-[#1a2d4d]
                        flex items-center
                        justify-center">
            <Shield className="w-8 h-8 text-primary
                              dark:text-[#6b9eff]" />
          </div>

          {/* Text */}
          <div className="text-center max-w-sm">
            <h2 className="text-title-md font-bold
                          text-on_surface
                          dark:text-[#e8eaf0] mb-2">
              Oracle Access Required
            </h2>
            <p className="text-body-md
                         text-on_surface_variant
                         dark:text-[#9ba3b8]">
              This area is restricted to authorized
              government officials only.
              Enter your secure access code to continue.
            </p>
          </div>

          {/* Primary CTA */}
          <OracleAuthButton variant="page" />

          {/* Secondary - go back */}
          <button
            onClick={() => router.push("/dashboard")}
            className="text-body-md
                     text-on_surface_variant
                     dark:text-[#9ba3b8]
                     hover:text-on_surface
                     dark:hover:text-[#e8eaf0]
                     transition-colors">
            ← Back to Dashboard
          </button>

          {/* Keyboard hint */}
          <p className="text-label-sm
                       text-on_surface_variant/50
                       dark:text-[#9ba3b8]/40">
            Tip: Press{" "}
            <kbd className="font-mono text-[10px]
                           bg-surface_container
                           dark:bg-[#1c2333]
                           px-1.5 py-0.5 rounded
                           text-on_surface_variant
                           dark:text-[#9ba3b8]">
              Ctrl
            </kbd>
            {" + "}
            <kbd className="font-mono text-[10px]
                           bg-surface_container
                           dark:bg-[#1c2333]
                           px-1.5 py-0.5 rounded
                           text-on_surface_variant
                           dark:text-[#9ba3b8]">
              Shift
            </kbd>
            {" + "}
            <kbd className="font-mono text-[10px]
                           bg-surface_container
                           dark:bg-[#1c2333]
                           px-1.5 py-0.5 rounded
                           text-on_surface_variant
                           dark:text-[#9ba3b8]">
              O
            </kbd>
            {" "}anywhere to open Oracle Access
          </p>

        </div>
      </>
    );
  }

  return <>{children}</>;
}