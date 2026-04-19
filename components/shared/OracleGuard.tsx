"use client";

import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OracleAuthButton from "./OracleAuthButton";

export default function OracleGuard({ children }: { children: React.ReactNode }) {
  const { isOracleMode } = useOracleAccessStore();

  if (!isOracleMode) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-sm animate-fade-in">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-4 tracking-tight">
          Restricted Institutional Access
        </h1>
        
        <p className="text-on_surface_variant dark:text-muted-foreground max-w-md mb-10 leading-relaxed font-medium">
          This sector requires an active Oracle session. Please authorize your government-linked credentials to continue.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm justify-center">
          <OracleAuthButton variant="page" />
        </div>

        <Link href="/dashboard" className="mt-12 group">
          <Button variant="ghost" className="text-on_surface_variant hover:text-primary font-bold uppercase tracking-widest text-[10px] h-10">
            <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
