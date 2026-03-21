"use client";
import { useState } from "react";
import { ShieldCheck, Shield, LogIn, LogOut } from "lucide-react";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { useAdminRole } from "@/hooks/useAdminRole";
import OracleAccessModal from "@/components/shared/OracleAccessModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Props {
  variant?: "navbar" | "sidebar" | "page";
}

export default function OracleAuthButton({ variant = "navbar" }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { isOracleMode, reset } = useOracleAccessStore();
  const { isOracle: hasDbRole } = useAdminRole();
  const [showModal, setShowModal] = useState(false);

  const isInOracleContext = isOracleMode || hasDbRole;

  const handleLogout = () => {
    reset();
    toast({
      title: "Oracle mode deactivated",
      description: "You have exited Oracle mode.",
    });
    router.push("/dashboard");
  };

  // NAVBAR VARIANT — compact
  if (variant === "navbar") {
    if (isInOracleContext) {
      return (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-primary dark:text-[#6b9eff] bg-primary_fixed dark:bg-[#1a2d4d] rounded-full px-3 py-1.5 hover:opacity-80 transition-opacity hidden sm:flex"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Oracle Mode
          <LogOut className="w-3 h-3 ml-0.5 opacity-60" />
        </button>
      );
    }

    if (hasDbRole) {
      return (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-on_surface_variant dark:text-[#9ba3b8] hover:text-primary dark:hover:text-[#6b9eff] px-2 py-1.5 rounded-lg hover:bg-surface_container dark:hover:bg-[#1c2333] transition-colors hidden sm:flex"
          >
            <Shield className="w-3.5 h-3.5" />
            Oracle Access
          </button>
          <OracleAccessModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </>
      );
    }

    return null;
  }

  // SIDEBAR VARIANT — full width
  if (variant === "sidebar") {
    if (isInOracleContext) {
      return (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-error dark:text-[#f87171] hover:bg-error_container dark:hover:bg-[#2d0a0a] transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Exit Oracle Mode
        </button>
      );
    }
    return null;
  }

  // PAGE VARIANT — large button for Access Denied screen
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-primary text-on_primary rounded-md px-6 py-3 text-base font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        <ShieldCheck className="w-4 h-4" />
        Enter Oracle Access Code
      </button>
      <OracleAccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}