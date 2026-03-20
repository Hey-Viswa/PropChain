"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, LayoutGrid, List, Filter as FilterIcon, Maximize2, Building2, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import { usePropertyStore } from "@/store/usePropertyStore";
import PropertyCard from "@/components/shared/PropertyCard";
import { useReadProperties } from "@/hooks/useReadProperties";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesPage() {
  const storeProperties = usePropertyStore(s => s.properties);
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

  // Fallback to store if no on-chain properties while disconnected or starting
  const displayProperties = properties.length > 0 ? mappedProperties : storeProperties;
  
  const filteredProperties = filterStatus === "all" 
    ? displayProperties 
    : displayProperties.filter(p => p.status === filterStatus);

  return (
    <div className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
              My Properties
            </h1>
            <p className="text-body-md text-on_surface_variant">
              Manage your portfolio of tokenized real estate assets. Monitor verification status and real-time valuations across your registry.
            </p>
          </div>
          <div>
            <Link href="/mint">
              <Button className="h-10 px-6 bg-primary text-on_primary shadow-floating">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tokenize New Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
          <div className="bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <div className="w-3 h-3 rounded-sm border-[1.5px] border-primary" />
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <p className="text-3xl font-bold font-display text-on_surface tracking-tight mb-1">$42,850,000</p>
            <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">Total Portfolio Valuation</p>
          </div>

          <div className="bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#835500]/10 flex items-center justify-center text-[#835500]">
                 <Building2 size={16} />
              </div>
              <span className="text-xs font-semibold text-primary">18 Assets</span>
            </div>
            <p className="text-2xl font-bold font-display text-on_surface tracking-tight mb-1">Minted Assets</p>
            <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">Successfully tokenized</p>
          </div>

          <div className="bg-surface_container_lowest rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-[hsl(199,89%,48%)]/10 flex items-center justify-center text-[hsl(199,89%,48%)]">
                 <span className="text-lg leading-none">📋</span>
              </div>
              <span className="text-xs font-semibold text-on_surface_variant">3 Pending</span>
            </div>
            <p className="text-2xl font-bold font-display text-on_surface tracking-tight mb-1">In Verification</p>
            <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">Current audit queue</p>
          </div>

          <div className="bg-[#1e2738] rounded-2xl p-6 shadow-floating text-white relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                 <Shield size={16} />
              </div>
              <p className="text-2xl font-bold font-display tracking-tight leading-tight">Portfolio<br/>Health</p>
            </div>
            <div className="relative z-10 w-full mt-4">
              <div className="flex items-center gap-3">
                <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-[#0ea5e9] rounded-full" />
                </div>
                <span className="text-xs font-bold text-white">94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setFilter('all')}
              className={filterStatus === 'all' ? "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-primary text-on_primary cursor-pointer transition-colors" : "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-surface_container text-on_surface_variant cursor-pointer hover:bg-surface_container_high transition-colors"}>
              All <span className="bg-surface_container px-1.5 py-0.5 rounded-md ml-1 text-[10px]">{displayProperties.length}</span>
            </button>
            <button 
              onClick={() => setFilter('verified')}
              className={filterStatus === 'verified' ? "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-primary text-on_primary cursor-pointer transition-colors" : "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-surface_container text-on_surface_variant cursor-pointer hover:bg-surface_container_high transition-colors"}>
              Verified
            </button>
            <button 
              onClick={() => setFilter('awaiting_oracle')}
              className={filterStatus === 'awaiting_oracle' ? "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-primary text-on_primary cursor-pointer transition-colors" : "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-surface_container text-on_surface_variant cursor-pointer hover:bg-surface_container_high transition-colors"}>
              Awaiting Oracle
            </button>
            <button 
              onClick={() => setFilter('needs_review')}
              className={filterStatus === 'needs_review' ? "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-primary text-on_primary cursor-pointer transition-colors" : "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-surface_container text-on_surface_variant cursor-pointer hover:bg-surface_container_high transition-colors"}>
              Needs Review
            </button>
            <button 
              onClick={() => setFilter('rejected')}
              className={filterStatus === 'rejected' ? "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-primary text-on_primary cursor-pointer transition-colors" : "rounded-full px-4 py-1.5 text-[0.75rem] font-medium bg-surface_container text-on_surface_variant cursor-pointer hover:bg-surface_container_high transition-colors"}>
              Rejected
            </button>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><LayoutGrid size={16} /></button>
            <button className="w-8 h-8 rounded text-on_surface_variant hover:bg-surface_container flex items-center justify-center"><List size={16} /></button>
            <div className="w-px h-6 bg-outline_variant/20 mx-1" />
            <button className="text-sm font-bold text-primary flex items-center gap-1.5 px-2">
              <FilterIcon size={14} /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-surface_container_lowest rounded-xl border border-outline_variant/20 shadow-sm mt-8">
            <Building2 size={48} className="text-on_surface_variant mb-4 mx-auto opacity-50" />
            <p className="text-title-md font-semibold text-on_surface">No properties found</p>
            <p className="text-body-md text-on_surface_variant mb-6">Mint your first property to get started.</p>
            <Link href="/mint">
              <Button>Start Process &rarr;</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}

            {/* Card Add New */}
            <Link
              href="/mint"
              className="rounded-2xl border-[1.5px] border-dashed border-outline_variant/40 bg-surface_container_lowest flex flex-col items-center justify-center min-h-[400px] hover:border-primary/50 hover:bg-primary/5 transition-colors group cursor-pointer p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={24} />
                <div className="absolute bottom-2.5 right-2 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                  <PlusCircle size={12} className="text-primary fill-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold font-display text-on_surface mb-2">Add New Property</h3>
              <p className="text-sm text-on_surface_variant text-center max-w-[200px] mb-6">
                Submit your property documents for verification and tokenization.
              </p>
              <span className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline">
                Start Process &rarr;
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
