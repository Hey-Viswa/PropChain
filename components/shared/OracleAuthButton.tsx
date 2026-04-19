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
          className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#E89874] bg-primary/10 dark:bg-[#3D1F10] rounded-xl px-4 py-2 hover:opacity-80 transition-opacity hidden sm:flex border border-primary/20"
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
            className="flex items-center gap-1.5 text-xs font-bold text-on_surface_variant dark:text-muted-foreground hover:text-primary dark:hover:text-[#E89874] px-3 py-2 rounded-xl hover:bg-stone/10 dark:hover:bg-white/5 transition-colors hidden sm:flex border border-transparent hover:border-stone/30"
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
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-error dark:text-[#f87171] hover:bg-error/5 transition-colors text-sm font-bold uppercase tracking-widest"
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
        className="flex items-center gap-2 bg-primary text-on_primary rounded-xl px-8 py-4 text-base font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] shadow-lg"
      >
        <ShieldCheck className="w-5 h-5" />
        Authorize Institutional Access
      </button>
      <OracleAccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}