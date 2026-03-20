import Image from "next/image";
import { Lock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  name: string;
  location: string;
  valuation: string;
  valuationChange: string;
  status: "MINTED" | "PENDING";
  imageUrl: string;
  hash?: string;
  auditPhase?: string;
}

export function AssetCard({
  name,
  location,
  valuation,
  valuationChange,
  status,
  imageUrl,
  hash,
  auditPhase,
}: AssetCardProps) {
  const isMinted = status === "MINTED";

  return (
    <div className="bg-surface_container_lowest rounded-2xl overflow-hidden hover:shadow-floating transition-all duration-300 border border-border/40 flex flex-col group h-full">
      {/* Image half */}
      <div className="relative h-[220px] w-full overflow-hidden">
        <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm",
            isMinted ? "bg-white text-primary" : "bg-[#fbeacc] text-[#865d1d]"
          )}>
            {status}
          </div>
        </div>

        {/* Bottom Overlay Info (Hash/Lock) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a142f]/90 via-[#0a142f]/50 to-transparent p-4 pt-16 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-md">
              {isMinted ? (
                // Mimics the logo hash icon
                <div className="flex gap-[2px]">
                   <div className="w-1.5 h-1.5 border-[1.5px] border-white rounded-[2px]" />
                   <div className="w-1.5 h-1.5 border-[1.5px] border-white rounded-[2px]" />
                </div>
              ) : (
                <Lock className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-white/90 text-[11px] tracking-wide font-mono font-medium">
              {isMinted ? hash : "Verifying Oracle..."}
            </span>
          </div>
        </div>
      </div>

      {/* Content half */}
      <div className="p-5 flex flex-col flex-1 bg-surface_container_lowest">
        <h3 className="text-lg font-bold text-on_surface mb-1.5 font-display">{name}</h3>
        <div className="flex items-center text-on_surface_variant text-sm mb-6">
          <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          {location}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border/30 pt-4">
          <div>
            <p className="text-[10px] font-bold text-on_surface_variant/60 uppercase tracking-widest mb-1.5">
              {isMinted ? "VALUATION" : "EST. VALUATION"}
            </p>
            <p className="text-[22px] font-bold font-display text-on_surface leading-none">{valuation}</p>
          </div>
          {isMinted ? (
             <div className="text-right flex flex-col items-end justify-end pb-0.5">
                <p className="text-success text-xs font-bold mb-2">{valuationChange}</p>
                <ChevronRightIcon />
             </div>
          ) : (
             <div className="text-right pb-1">
                <p className="text-on_surface_variant/60 text-xs font-medium">{auditPhase}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
