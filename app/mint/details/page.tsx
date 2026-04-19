"use client";

import { useMintStore } from "@/store/useMintStore";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info, MapPin, Target, CheckCircle2, Shield, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const detailsSchema = z.object({
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/, "Invalid ULPIN format (e.g. MH0123456789)"),
  area: z.coerce.number().positive("Area must be positive"),
  type: z.enum(["Residential", "Commercial", "Agricultural"]),
  address: z.string().min(10, "Address too short"),
  district: z.string().min(1, "District required"),
  state: z.string().min(1, "State required"),
  description: z.string().max(500).optional(),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export default function MintStep1() {
  const router = useRouter();
  const { details, setDetails } = useMintStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isValid, errors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (details.ulpin) setValue("ulpin", details.ulpin);
    if (details.area) setValue("area", details.area);
    if (details.type) setValue("type", details.type as any);
    if (details.address) setValue("address", details.address);
    if (details.district) setValue("district", details.district);
    if (details.state) setValue("state", details.state);
    if (details.description) setValue("description", details.description);
  }, [details, setValue]);

  const onSubmit = (data: DetailsFormValues) => {
    setDetails(data);
    router.push("/mint/upload");
  };

  const labelClass = "block text-xs font-bold text-foreground mb-2 uppercase tracking-wider";
  const inputClass = "w-full bg-muted/30 dark:bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 px-4 text-foreground placeholder:text-muted-foreground/60 transition-all";

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20">
      
      {/* Page Title & Intro */}
      <div className="text-center max-w-2xl mx-auto mt-4 mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Mint Property NFT
        </h1>
        <p className="text-muted-foreground text-base">
          Initiate the tokenization process by providing legal identification and physical characteristics of your asset.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-card rounded-3xl p-8 xl:p-12 shadow-card border border-stone dark:border-[#2a2520]">
        <div className="flex items-center gap-3 mb-10 border-b border-stone dark:border-[#2a2520] pb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Info size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-foreground">Step 1: Identification</h2>
            <p className="text-xs text-on_surface_variant">Verified Registry Data</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1 */}
          <div>
            <label className={labelClass}>Unique Land Parcel Identification Number (ULPIN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on_surface_variant/40">
                <Target size={18} />
              </div>
              <input 
                type="text" 
                {...register("ulpin")}
                placeholder="MH0123456789"
                className={cn(inputClass, "pl-12 font-mono uppercase tracking-widest", errors.ulpin && "border-error focus:ring-error")}
              />
            </div>
            {errors.ulpin ? (
              <p className="text-[10px] font-bold text-error mt-2 flex items-center gap-1">
                <AlertTriangle size={10} /> {errors.ulpin.message}
              </p>
            ) : (
              <p className="text-[10px] font-medium text-on_surface_variant/60 mt-2 italic">Format: 2 letters followed by 10 digits.</p>
            )}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className={labelClass}>Total Area (sq. ft.)</label>
              <div className="relative">
                <input 
                  type="number" 
                  {...register("area")}
                  placeholder="e.g. 2450"
                  className={cn(inputClass, errors.area && "border-error focus:ring-error")}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on_surface_variant/40 font-bold text-[10px] uppercase">
                  SQFT
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Property Classification</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn("h-12 rounded-xl border-stone dark:border-[#2a2520]", errors.type && "border-error")}>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural / Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 3 Address */}
          <div className="space-y-4">
            <label className={labelClass}>Physical Site Address</label>
            <input 
              type="text" 
              {...register("address")}
              placeholder="Street Address / Plot No."
              className={cn(inputClass, errors.address && "border-error")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input 
                type="text" 
                {...register("district")}
                placeholder="City / District"
                className={cn(inputClass, errors.district && "border-error")}
              />
              <input 
                type="text" 
                {...register("state")}
                placeholder="State"
                className={cn(inputClass, errors.state && "border-error")}
              />
              <input 
                type="text" 
                placeholder="Postal Code"
                className={inputClass}
              />
            </div>
          </div>

          {/* Map Geofence */}
          <div className="w-full h-48 sm:h-72 rounded-2xl border border-stone dark:border-[#2a2520] overflow-hidden relative group">
             {/* Map Placeholder Image */}
             <div className="absolute inset-0 bg-[#e5e7eb]">
               <Image 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                 alt="Map view" 
                 fill 
                 className="object-cover opacity-60 mix-blend-multiply dark:mix-blend-normal" 
               />
               
               {/* Pin */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-floating border-4 border-white dark:border-[#1a1916]">
                 <div className="w-3 h-3 rounded-full bg-white" />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 border-2 border-primary/20 rounded-full animate-pulse" />
             </div>
             
             {/* Map Status Bar */}
             <div className="absolute bottom-6 inset-x-6 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center shadow-floating border border-stone/50 dark:border-white/5">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                   <Target size={16} className="text-secondary" />
                 </div>
                 <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Geofence Sync Enabled</span>
               </div>
               <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80">
                 Reposition Pin
               </button>
             </div>
          </div>

          {/* Actions */}
          <div className="pt-10 border-t border-stone dark:border-[#2a2520] flex flex-col sm:flex-row justify-between items-center gap-6">
            <button type="button" className="text-xs font-bold text-on_surface_variant hover:text-primary transition-colors uppercase tracking-[0.15em] order-2 sm:order-1">
              Save To Vault
            </button>
            <Button 
              type="submit" 
              disabled={!isValid}
              size="lg"
              className="h-14 px-10 bg-primary text-on_primary shadow-floating font-bold rounded-xl uppercase tracking-widest text-xs order-1 sm:order-2 w-full sm:w-auto"
            >
              Continue To Documents <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Info Cards Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoBadge 
          icon={<CheckCircle2 size={14} />} 
          title="Legal Compliance" 
          desc="Cross-referenced with ULPIN database."
          accent="primary"
        />
        <InfoBadge 
          icon={<Shield size={14} />} 
          title="Encryption" 
          desc="Hashed on-chain for record immutability."
          accent="secondary"
        />
        <InfoBadge 
          icon={<Clock size={14} />} 
          title="Support" 
          desc="24/7 legal auditing assistance available."
          accent="neutral"
        />
      </div>

    </div>
  );
}

function InfoBadge({ icon, title, desc, accent }: { icon: any, title: string, desc: string, accent: "primary" | "secondary" | "neutral" }) {
  const styles = {
    primary:   "bg-primary/5 border-primary/10 text-primary",
    secondary: "bg-secondary/5 border-secondary/10 text-secondary",
    neutral:   "bg-stone/10 border-stone/20 text-on_surface_variant",
  }[accent];

  return (
    <div className={cn("flex items-start gap-4 p-5 rounded-2xl border", styles)}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", 
        accent === "primary" ? "bg-primary text-white" : accent === "secondary" ? "bg-secondary text-white" : "bg-on_surface_variant text-white"
      )}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-[11px] text-muted-foreground leading-tight font-medium opacity-80">{desc}</p>
      </div>
    </div>
  );
}
