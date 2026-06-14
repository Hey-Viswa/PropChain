"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, LayoutGrid, List, Filter as FilterIcon, Maximize2, Building2, MapPin, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePropertyStore } from "@/store/usePropertyStore";
import PropertyCard from "@/components/shared/PropertyCard";
import { useReadProperties } from "@/hooks/useReadProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PropertiesPage() {
  const filterStatus = usePropertyStore(s => s.filterStatus);
  const setFilter  = usePropertyStore(s => s.setFilter);

  const { properties, loading } = useReadProperties();

  const mappedProperties = properties.map(p => ({
    id:              p.tokenId.toString(),
    ulpin:           p.ulpin,
    address:         p.physicalAddress,
    area:            p.areaSqFt,
    type:            p.propertyType ?? "Residential",
    status:          p.isApproved ? "verified" : "awaiting_oracle",
    owner:           p.registeredBy,
    registeredAt:    new Date(p.registeredAt * 1000).toLocaleDateString(),
    ipfsCid:         p.ipfsDocHash,
    aiConfidence:    0,
    hasEncumbrance:  p.hasEncumbrance,
  })) as any[];

  // Show only real on-chain properties (no mock fallback).
  const displayProperties = mappedProperties;
  const total = mappedProperties.length;
  const verified = mappedProperties.filter((p) => p.status === "verified").length;
  const awaiting = mappedProperties.filter((p) => p.status === "awaiting_oracle").length;
  const encumbered = mappedProperties.filter((p) => p.hasEncumbrance).length;
  
  const filteredProperties = filterStatus === "all" 
    ? displayProperties 
    : displayProperties.filter(p => p.status === filterStatus);

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight">
              My Institutional Portfolio
            </h1>
            <p className="text-sm text-on_surface_variant text-on_surface_variant dark:text-muted-foreground mt-1">
              Manage your verified real estate assets and monitor on-chain valuations.
            </p>
          </div>
          <div>
            <Link href="/mint">
              <Button className="h-10 px-6 bg-primary text-on_primary shadow-floating text-[10px] font-bold uppercase tracking-widest rounded-xl">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                Tokenize New Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row (real counts) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: <Building2 size={16} />, label: "Total Properties", value: total, tone: "bg-primary/5 text-primary border-primary/10" },
            { icon: <Shield size={16} />, label: "Verified", value: verified, tone: "bg-success/5 text-success border-success/10" },
            { icon: <TrendingUp size={16} />, label: "Awaiting Oracle", value: awaiting, tone: "bg-secondary/5 text-secondary border-secondary/10" },
            { icon: <Shield size={16} />, label: "With Encumbrance", value: encumbered, tone: "bg-stone/10 text-on_surface_variant border-stone/20 dark:bg-white/5" },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border mb-4", s.tone)}>{s.icon}</div>
                <p className="text-2xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight mb-1">{s.value}</p>
                <p className="text-[10px] font-bold text-on_surface_variant dark:text-muted-foreground uppercase tracking-[0.15em] opacity-60">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 py-4 border-y border-stone/30 dark:border-white/5">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Assets', count: displayProperties.length },
              { id: 'verified', label: 'Verified' },
              { id: 'awaiting_oracle', label: 'Awaiting Oracle' },
              { id: 'needs_review', label: 'Needs Review' },
              { id: 'rejected', label: 'Rejected' },
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={cn(
                  "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                  filterStatus === btn.id 
                    ? "bg-primary text-on_primary shadow-sm" 
                    : "bg-sand dark:bg-card border border-stone/50 dark:border-white/5 text-on_surface_variant text-on_surface_variant dark:text-muted-foreground hover:bg-stone/20"
                )}
              >
                {btn.label} {btn.count !== undefined && <span className="ml-1 opacity-50">({btn.count})</span>}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="flex bg-sand dark:bg-card p-1 rounded-xl border border-stone/50 dark:border-white/5">
              <button className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 text-primary shadow-sm flex items-center justify-center transition-all"><LayoutGrid size={15} /></button>
              <button className="w-8 h-8 rounded-xl text-on_surface_variant dark:text-[#6b6560] hover:text-on_surface flex items-center justify-center transition-all"><List size={15} /></button>
            </div>
            <div className="w-px h-6 bg-stone/30 dark:bg-white/5 mx-1" />
            <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FilterIcon size={14} /> Advanced
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[240px] w-full rounded-2xl bg-stone/10 dark:bg-card" />
            <Skeleton className="h-[240px] w-full rounded-2xl bg-stone/10 dark:bg-card" />
            <Skeleton className="h-[240px] w-full rounded-2xl bg-stone/10 dark:bg-card" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="flex flex-col items-center justify-center text-center p-20 border-stone/50 dark:bg-card dark:border-white/5 shadow-sm mt-8">
            <div className="w-20 h-20 rounded-3xl bg-stone/10 dark:bg-white/5 flex items-center justify-center mb-6">
              <Building2 size={40} className="text-on_surface_variant dark:text-[#6b6560] opacity-40" />
            </div>
            <p className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">No Institutional Assets Found</p>
            <p className="text-sm text-on_surface_variant text-on_surface_variant dark:text-muted-foreground mb-8 max-w-xs">Initialize your first on-chain property registration to begin building your portfolio.</p>
            <Link href="/mint">
              <Button className="rounded-xl h-11 px-8 text-[10px] font-bold uppercase tracking-widest bg-primary text-white">Start Tokenization &rarr;</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}

            {/* Card Add New */}
            <Link
              href="/mint"
              className="rounded-2xl border-2 border-dashed border-stone/50 dark:bg-card dark:border-white/10 flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer p-8 relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PlusCircle size={28} />
              </div>
              <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Add Asset</h3>
              <p className="text-[11px] text-on_surface_variant text-on_surface_variant dark:text-muted-foreground text-center max-w-[180px] font-medium leading-relaxed opacity-60">
                Submit documents for decentralized verification.
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
