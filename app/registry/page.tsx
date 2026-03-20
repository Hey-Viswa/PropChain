"use client";

import { Globe, Search, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegistryPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center pt-8 pb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
          <Globe size={32} />
        </div>
        <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-4xl sm:text-5xl mb-4">
          Public Property Registry
        </h1>
        <p className="text-lg text-on_surface_variant max-w-2xl mx-auto">
          Explore all verified real estate assets on the PropChain network. Fully transparent and immutable records.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface_container_lowest rounded-2xl p-4 shadow-floating border border-outline_variant/10 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Asset ID, Location, or Owner Hash..." 
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none outline-none text-on_surface font-medium placeholder:text-on_surface_variant/60"
          />
        </div>
        <Button className="h-12 px-8 bg-primary rounded-xl text-white font-semibold">Search Network</Button>
      </div>

      {/* Mock Results */}
      <div className="pt-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on_surface_variant mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success"></div> Live Network Feed (Last 100 Minted)
        </h3>

        {[
          { id: "PC-8829 NYC", name: "The Azure Heights", val: "$4.2M", loc: "Manhattan, NY" },
          { id: "PC-9912 SG", name: "Vertex Industrial", val: "$18.5M", loc: "Jurong, Singapore" },
          { id: "PC-1102 LDN", name: "Thames View Apts", val: "$8.1M", loc: "London, UK" },
        ].map((item, i) => (
           <div key={i} className="bg-surface_container_lowest border border-outline_variant/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card transition-shadow cursor-pointer group">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-surface_container flex items-center justify-center text-on_surface_variant">
                   <Building2 size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-on_surface text-lg group-hover:text-primary transition-colors">{item.name}</h4>
                   <p className="text-sm text-on_surface_variant flex items-center gap-2 mt-1">
                     <span className="font-mono text-xs">{item.id}</span> • {item.loc}
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-6 sm:text-right">
                <div className="hidden sm:block">
                   <p className="text-[10px] uppercase font-bold text-on_surface_variant mb-0.5">TVL</p>
                   <p className="font-bold text-on_surface">{item.val}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface_container flex items-center justify-center text-on_surface group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                   <ArrowRight size={18} />
                </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
