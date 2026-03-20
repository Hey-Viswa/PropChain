"use client";

import { use } from "react";
import { Box, MapPin, Share2, History, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function PropertyIdPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Property Details
          </h1>
          <p className="text-body-md text-on_surface_variant flex items-center gap-2">
            <MapPin size={16} /> Asset ID: <span className="font-mono text-primary">{resolvedParams.id || "0x4A2...19F"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface_container_lowest rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
          <div className="relative h-64 w-full bg-surface_container rounded-xl overflow-hidden mb-6">
            <Image 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" 
              alt="Property" 
              fill 
              className="object-cover" 
            />
          </div>
          <h3 className="text-2xl font-bold font-display text-on_surface mb-4">Core Metadata</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant">Owner Wallet</span>
              <span className="font-mono text-primary">0x1A2B...9F0E</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant">Status</span>
              <span className="text-success font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> ACTIVE MINT</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant">Valuation Oracle</span>
              <span className="text-on_surface font-medium">$42.4M USD</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-surface_container_lowest rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center">
                   <Share2 size={20} />
                </div>
                <div>
                   <h3 className="text-xl font-bold font-display text-on_surface">Fractional Shares</h3>
                   <p className="text-xs text-on_surface_variant">Current distribution of ownership</p>
                </div>
             </div>
             <p className="text-sm text-on_surface_variant italic">Dummy component - No logic required for Phase 1</p>
           </div>

           <div className="bg-surface_container_lowest rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                   <History size={20} />
                </div>
                <div>
                   <h3 className="text-xl font-bold font-display text-on_surface">Audit Trail</h3>
                   <p className="text-xs text-on_surface_variant">On-chain history events</p>
                </div>
             </div>
             <p className="text-sm text-on_surface_variant italic">Dummy component - No logic required for Phase 1</p>
           </div>
        </div>
      </div>
    </div>
  );
}
