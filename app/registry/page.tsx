import { Suspense } from "react";
import { Globe, Search, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegistryPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center pt-12 pb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 shadow-sm">
          <Globe size={32} />
        </div>
        <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-tight tracking-tight text-4xl sm:text-5xl mb-4">
          Public Property Registry
        </h1>
        <p className="text-lg text-on_surface_variant dark:text-muted-foreground max-w-2xl mx-auto font-medium">
          Explore all verified real estate assets on the PropChain network. Fully transparent and immutable records.
        </p>
      </div>

      {/* Search & Filter */}
      <Card className="rounded-2xl p-2 border-stone/50 dark:bg-card dark:border-white/5 shadow-floating flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant dark:text-muted-foreground w-5 h-5 opacity-40" />
          <input 
            type="text" 
            placeholder="Search by Asset ID, Location, or Owner Hash..." 
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none outline-none text-on_surface dark:text-[#e8eaf0] font-medium placeholder:text-on_surface_variant/40"
          />
        </div>
        <Button className="h-12 px-10 bg-primary rounded-xl text-on_primary font-bold uppercase tracking-widest text-xs shadow-lg">Search Network</Button>
      </Card>

      {/* Mock Results */}
      <Suspense fallback={<div className="h-48 bg-stone/10 dark:bg-card rounded-xl animate-shimmer" />}>
        <div className="pt-12 space-y-4">
         <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on_surface_variant dark:text-muted-foreground mb-8 flex items-center gap-2.5 opacity-60">
          <div className="w-2 h-2 rounded-full bg-success"></div> Live Network Feed (Last 100 Minted)
         </h3>

         {[
          { id: "PC-8829 NYC", name: "The Azure Heights", val: "$4.2M", loc: "Manhattan, NY" },
          { id: "PC-9912 SG", name: "Vertex Industrial", val: "$18.5M", loc: "Jurong, Singapore" },
          { id: "PC-1102 LDN", name: "Thames View Apts", val: "$8.1M", loc: "London, UK" },
         ].map((item, i) => (
           <Card key={i} className="rounded-2xl border-stone/30 dark:bg-card dark:border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-stone/10 dark:bg-white/5 flex items-center justify-center text-on_surface_variant dark:text-muted-foreground border border-stone/20 dark:border-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Building2 size={28} />
              </div>
              <div>
                <h4 className="font-bold text-on_surface dark:text-[#e8eaf0] text-xl tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="text-sm text-on_surface_variant dark:text-muted-foreground flex items-center gap-2 mt-1.5 font-medium">
                  <span className="font-mono text-xs opacity-60">{item.id}</span>
                  <span className="opacity-20">•</span>
                  <span>{item.loc}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 sm:text-right">
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-on_surface_variant dark:text-muted-foreground mb-1 opacity-50 tracking-wider">TVL</p>
                <p className="font-bold text-on_surface dark:text-[#e8eaf0] text-lg">{item.val}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone/5 dark:bg-white/5 flex items-center justify-center text-on_surface_variant dark:text-[#e8eaf0] group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
           </Card>
         ))}
        </div>
      </Suspense>
    </div>
  );
}
