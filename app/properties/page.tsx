"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, LayoutGrid, List, Filter as FilterIcon, Maximize2, Building2, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PropertiesPage() {
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
          <div className="flex gap-4 border-b border-outline_variant/20 w-full sm:w-auto">
            <button className="px-3 py-2 text-sm font-bold text-on_surface border-b-2 border-on_surface">All Assets <span className="bg-surface_container px-1.5 py-0.5 rounded-md ml-1 text-xs">21</span></button>
            <button className="px-3 py-2 text-sm font-medium text-on_surface_variant hover:text-on_surface transition-colors">Residential</button>
            <button className="px-3 py-2 text-sm font-medium text-on_surface_variant hover:text-on_surface transition-colors">Commercial</button>
            <button className="px-3 py-2 text-sm font-medium text-on_surface_variant hover:text-on_surface transition-colors">Industrial</button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-surface_container_lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 relative">
            <div className="relative h-48 w-full bg-surface_container">
              <Image 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" 
                alt="Skyline Plaza" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-success flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> Minted
              </div>
              <button className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={14} />
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold font-display text-on_surface mb-1">Skyline Plaza A-101</h3>
              <p className="text-xs text-on_surface_variant flex items-center gap-1 mb-6">
                <MapPin size={12} /> Downtown Core, Singapore
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-outline_variant/20 mt-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Valuation</p>
                  <p className="text-lg font-bold text-on_surface">$12.4M</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Ownership</p>
                  <p className="text-lg font-bold text-primary">100%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-surface_container_lowest border-outline_variant/30 font-semibold shadow-none">Details</Button>
                <Button className="w-full bg-primary font-semibold shadow-none">Manage Shares</Button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface_container_lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 relative">
            <div className="relative h-48 w-full bg-[#eaf4f1]">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" 
                alt="TechBridge Hub" 
                fill 
                className="object-cover opacity-80 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-[#d97706] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Pending Audit
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold font-display text-on_surface mb-1">TechBridge Hub</h3>
              <p className="text-xs text-on_surface_variant flex items-center gap-1 mb-6">
                <MapPin size={12} /> Palo Alto, California
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-outline_variant/20 mt-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#d97706] mb-1">Est. Valuation</p>
                  <p className="text-lg font-bold text-on_surface">$8.2M</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Status</p>
                  <p className="text-sm font-semibold text-on_surface">75% Verified</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-surface_container_lowest border-outline_variant/30 text-primary font-semibold shadow-none">View Audit</Button>
                <Button variant="outline" disabled className="w-full bg-surface_container border-transparent text-on_surface_variant font-semibold opacity-70">Actions Locked</Button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface_container_lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 relative">
            <div className="relative h-48 w-full bg-surface_container">
              <Image 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" 
                alt="The Meridian Heights" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-success flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> Minted
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold font-display text-on_surface mb-1">The Meridian Heights</h3>
              <p className="text-xs text-on_surface_variant flex items-center gap-1 mb-6">
                <MapPin size={12} /> Zurich, Switzerland
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-outline_variant/20 mt-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Valuation</p>
                  <p className="text-lg font-bold text-on_surface">$15.9M</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Ownership</p>
                  <p className="text-lg font-bold text-primary">45%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-surface_container_lowest border-outline_variant/30 font-semibold shadow-none">Details</Button>
                <Button className="w-full bg-primary font-semibold shadow-none">Manage Shares</Button>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface_container_lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-outline_variant/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 relative">
            <div className="relative h-48 w-full bg-surface_container">
              <Image 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop" 
                alt="Vertex Living B2" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-[#0ea5e9] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" /> Minted
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold font-display text-on_surface mb-1">Vertex Living B2</h3>
              <p className="text-xs text-on_surface_variant flex items-center gap-1 mb-6">
                <MapPin size={12} /> London, UK
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-outline_variant/20 mt-auto">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Valuation</p>
                  <p className="text-lg font-bold text-on_surface">$4.5M</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Ownership</p>
                  <p className="text-lg font-bold text-primary">100%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-surface_container_lowest border-outline_variant/30 font-semibold shadow-none">Details</Button>
                <Button className="w-full bg-primary font-semibold shadow-none">Manage Shares</Button>
              </div>
            </div>
          </div>

          {/* Card 5 - Add New */}
          <div className="rounded-2xl border-[1.5px] border-dashed border-outline_variant/40 bg-surface_container_lowest flex flex-col items-center justify-center min-h-[400px] hover:border-primary/50 hover:bg-primary/5 transition-colors group cursor-pointer p-8">
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
             <button className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline">
               Start Process &rarr;
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
