"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useAdminRole } from "@/hooks/useAdminRole";
import OracleAuthButton from "@/components/shared/OracleAuthButton";
import Link from "next/link";

export default function OracleLoginPage() {
  const router = useRouter();
  const { isOracleMode } = useOracleAccessStore();
  const { isOracle } = useAdminRole();

  // Already in Oracle mode — redirect to queue
  useEffect(() => {
    if (isOracleMode || isOracle) {
      router.push("/oracle/queue");
    }
  }, [isOracleMode, isOracle, router]);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Back to dashboard */}
        <Link href="/dashboard"
              className="inline-flex items-center gap-2 text-body-md text-on_surface_variant dark:text-[#9ba3b8] hover:text-on_surface dark:hover:text-[#e8eaf0] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Card */}
        <div className="bg-surface_container_lowest dark:bg-[#1a1916] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,26,67,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.4)]">

          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary to-primary_container" />

          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary_fixed dark:bg-[#3D1F10] flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary dark:text-[#E89874]" />
              </div>
              <div>
                <h1 className="text-headline-md font-bold text-on_surface dark:text-[#e8eaf0]">
                  Oracle Portal
                </h1>
                <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mt-1">
                  Government Authority Access
                </p>
              </div>
            </div>

            {/* Info tiles */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Verified",
                  desc:  "On-chain role",
                },
                {
                  icon: Lock,
                  label: "Encrypted",
                  desc:  "SHA-256 auth",
                },
                {
                  icon: Shield,
                  label: "Isolated",
                  desc:  "Tab-scoped",
                },
              ].map((item) => (
                <div key={item.label}
                     className="p-3 rounded-xl bg-surface_container_low dark:bg-[#1c2333] text-center">
                  <item.icon className="w-5 h-5 text-primary dark:text-[#E89874] mx-auto mb-1.5" />
                  <p className="text-label-sm font-bold text-on_surface dark:text-[#e8eaf0]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-on_surface_variant dark:text-[#9ba3b8]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Access code button */}
            <div className="flex flex-col items-center gap-3">
              <OracleAuthButton variant="page" />

              <p className="text-label-sm text-on_surface_variant/50 dark:text-[#9ba3b8]/40 text-center">
                Or press{" "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded text-on_surface_variant dark:text-[#9ba3b8]">
                  Ctrl
                </kbd>
                {" + "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded text-on_surface_variant dark:text-[#9ba3b8]">
                  Shift
                </kbd>
                {" + "}
                <kbd className="font-mono text-[10px] bg-surface_container dark:bg-[#1c2333] px-1.5 py-0.5 rounded text-on_surface_variant dark:text-[#9ba3b8]">
                  O
                </kbd>
                {" "}anywhere
              </p>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-on_surface_variant/40 dark:text-[#9ba3b8]/30 text-center leading-relaxed">
              Unauthorized access attempts are logged.
              This portal is for authorized government
              officials only.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}