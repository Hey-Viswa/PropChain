"use client";

import { useParams } from "next/navigation";
import { usePropertyStore } from "@/store/usePropertyStore";
import { Box, MapPin, Share2, History, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfidenceBar from "@/components/shared/ConfidenceBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PropertyIdPage() {
  const params = useParams();
  const id = params.id as string;
  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id));

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md text-on_surface text-on_surface dark:text-[#e8eaf0] font-semibold">
          Property not found
        </p>
        <p className="text-body-md text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">
          The property you are looking for does not exist.
        </p>
        <Link href="/properties">
          <Button variant="default">Back to My Properties</Button>
        </Link>
      </div>
    );
  }

  const truncate = (str: string, first: number, last: number) => {
    if (!str) return "";
    return str.substring(0, first) + "..." + str.substring(str.length - last);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            {property.address}
          </h1>
          <p className="text-body-md text-on_surface_variant text-on_surface_variant dark:text-muted-foreground flex items-center gap-2">
            <MapPin size={16} /> Asset ID: <span className="font-mono text-primary">{property.id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
          <div className="relative h-64 w-full bg-stone/10 dark:bg-white/5 rounded-xl overflow-hidden mb-6">
            <Image 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" 
              alt="Property" 
              fill 
              className="object-cover" 
            />
          </div>
          <h3 className="text-2xl font-bold font-display text-on_surface text-on_surface dark:text-[#e8eaf0] mb-4">Core Metadata</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Owner Wallet</span>
              <span className="font-mono text-primary">{truncate(property.owner, 6, 4)}</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Status</span>
              <StatusBadge status={property.status} />
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">ULPIN</span>
              <span className="text-on_surface text-on_surface dark:text-[#e8eaf0] font-medium">{property.ulpin}</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Area</span>
              <span className="text-on_surface text-on_surface dark:text-[#e8eaf0] font-medium">{property.area}</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Type</span>
              <span className="text-on_surface text-on_surface dark:text-[#e8eaf0] font-medium">{property.type}</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Registered At</span>
              <span className="text-on_surface text-on_surface dark:text-[#e8eaf0] font-medium">{property.registeredAt}</span>
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">IPFS CID</span>
              <span className="font-mono text-primary">{truncate(property.ipfsCid, 8, 6)}</span>
            </div>
            <div className="flex flex-col border-b border-outline_variant/10 pb-3 pt-1">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground mb-2">AI Confidence</span>
              <ConfidenceBar score={property.aiConfidence} showLabel={false} />
            </div>
            <div className="flex justify-between border-b border-outline_variant/10 pb-2 pt-1 gap-2 items-center">
              <span className="text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Encumbrance</span>
              <span className={`text-sm font-semibold flex items-center gap-1 ${property.hasEncumbrance ? 'text-error' : 'text-success'}`}>
                <span className={`w-2 h-2 rounded-full ${property.hasEncumbrance ? 'bg-error' : 'bg-success'}`}></span>
                {property.hasEncumbrance ? "Active Lien Registered" : "No Active Liens"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center">
                   <Share2 size={20} />
                </div>
                <div>
                   <h3 className="text-xl font-bold font-display text-on_surface text-on_surface dark:text-[#e8eaf0]">Fractional Shares</h3>
                   <p className="text-xs text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">Current distribution of ownership</p>
                </div>
             </div>
             <p className="text-sm text-on_surface_variant text-on_surface_variant dark:text-muted-foreground italic">Dummy component - No logic required for Phase 1</p>
           </div>

           <div className="bg-card dark:bg-card rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                   <History size={20} />
                </div>
                <div>
                   <h3 className="text-xl font-bold font-display text-on_surface text-on_surface dark:text-[#e8eaf0]">Audit Trail</h3>
                   <p className="text-xs text-on_surface_variant text-on_surface_variant dark:text-muted-foreground">On-chain history events</p>
                </div>
             </div>
             <p className="text-sm text-on_surface_variant text-on_surface_variant dark:text-muted-foreground italic">Dummy component - No logic required for Phase 1</p>
           </div>
        </div>
      </div>
    </div>
  );
}
