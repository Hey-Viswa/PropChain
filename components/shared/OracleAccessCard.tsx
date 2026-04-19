"use client";

import { useState } from "react";
import { Shield, ChevronRight, CheckCircle2 } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OracleAccessModal from "./OracleAccessModal";

export default function OracleAccessCard() {
  const { isOracle } = useAdminRole();
  const { isOracleMode } = useOracleAccessStore();
  const [showModal, setShowModal] = useState(false);

  if (!isOracle || isOracleMode) return null;

  return (
    <>
      <Card
        className={cn(
          "bg-white dark:bg-card border-stone/50 dark:border-white/5",
          "rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all"
        )}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
                  Authorized Oracle Node Detected
                </h3>
                <p className="text-sm text-on_surface_variant dark:text-muted-foreground mt-0.5 font-medium">
                  Active government credentials found. Switch to Oracle mode to access the verification queue.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto h-11 px-8 rounded-xl bg-primary text-on_primary font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 group"
            >
              Enter Oracle Mode
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <OracleAccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border bg-card text-card-foreground shadow-sm", className)}>{children}</div>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
