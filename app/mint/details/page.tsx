"use client";

import { useMintStore } from "@/store/useMintStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info, MapPin, Target, CheckCircle2, Shield, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

const detailsSchema = z.object({
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/),
  area: z.coerce.number().positive(),
  type: z.enum(["Residential", "Commercial", "Agricultural"]),
  address: z.string().min(10),
  district: z.string().min(1),
  state: z.string().min(1),
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
    formState: { isValid },
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

  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      
      {/* Page Title & Intro */}
      <div className="text-center max-w-2xl mx-auto mt-4 mb-10">
        <h1 className="text-display font-bold text-on_surface dark:text-[#e8eaf0] font-display text-4xl mb-3">Mint Asset</h1>
        <p className="text-on_surface_variant dark:text-[#9ba3b8]">
          Initiate the tokenization process for your real estate asset. Provide verified legal and physical details to begin verification.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl p-8 xl:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
        <div className="flex items-center gap-2 mb-8 border-b border-outline_variant/10 pb-4">
          <Info size={18} className="text-primary" />
          <h2 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0]">Step 1: Property Identification</h2>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1 */}
          <div>
            <label className="block text-xs font-bold text-on_surface dark:text-[#e8eaf0] mb-2">Unique Land Parcel Identification Number (ULPIN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Target size={16} className="text-on_surface_variant/50" />
              </div>
              <input 
                type="text" 
                {...register("ulpin")}
                placeholder="14-digit alphanumeric ID"
                className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 pl-12 pr-4 text-on_surface dark:text-[#e8eaf0] transition-all font-mono"
              />
            </div>
            <p className="text-[10px] italic text-on_surface_variant dark:text-[#9ba3b8] mt-2">Enter the government-issued ULPIN as it appears on the official land record.</p>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-on_surface dark:text-[#e8eaf0] mb-2">Total Area (sq. ft.)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-on_surface_variant/50 font-medium">📐</span>
                </div>
                <input 
                  type="number" 
                  {...register("area")}
                  placeholder="e.g. 2450"
                  className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 pl-12 pr-4 text-on_surface dark:text-[#e8eaf0] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on_surface dark:text-[#e8eaf0] mb-2">Property Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-on_surface_variant/50 font-medium">🏢</span>
                </div>
                <select {...register("type")} className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 pl-12 pr-10 text-on_surface dark:text-[#e8eaf0] transition-all appearance-none cursor-pointer">
                  <option value="">Select Property Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agricultural">Agricultural / Industrial</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on_surface_variant dark:text-[#9ba3b8]"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 Address */}
          <div>
            <label className="block text-xs font-bold text-on_surface dark:text-[#e8eaf0] mb-2">Site Address</label>
            <div className="space-y-4">
              <input 
                type="text" 
                {...register("address")}
                placeholder="Street Address / Plot No."
                className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 px-4 text-on_surface dark:text-[#e8eaf0] transition-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  {...register("district")}
                  placeholder="City"
                  className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 px-4 text-on_surface dark:text-[#e8eaf0] transition-all"
                />
                <input 
                  type="text" 
                  {...register("state")}
                  placeholder="State/Province"
                  className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 px-4 text-on_surface dark:text-[#e8eaf0] transition-all"
                />
                <input 
                  type="text" 
                  placeholder="Postal Code"
                  className="w-full bg-surface_container_low dark:bg-[#161b27] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12 px-4 text-on_surface dark:text-[#e8eaf0] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Map Geofence */}
          <div className="w-full h-48 sm:h-64 rounded-xl border border-outline_variant/20 overflow-hidden relative group">
             {/* Map Placeholder Image */}
             <div className="absolute inset-0 bg-[#e5e7eb]">
               <Image 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                 alt="Map view" 
                 fill 
                 className="object-cover opacity-60" 
               />
               
               {/* Pin */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-floating border-2 border-white">
                 <div className="w-2.5 h-2.5 rounded-full bg-white" />
               </div>
               {/* Geofence area simulation */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 border border-primary/30 rounded-full" />
             </div>
             
             {/* Map Status Bar */}
             <div className="absolute bottom-4 inset-x-4 bg-surface_container_lowest dark:bg-[#131820]/90 backdrop-blur-md rounded-lg p-3 flex justify-between items-center shadow-sm border border-outline_variant/10">
               <div className="flex items-center gap-2">
                 <Target size={14} className="text-[#835500]" />
                 <span className="text-[10px] font-bold text-on_surface dark:text-[#e8eaf0] uppercase tracking-widest">Geofence Coordinates Sync Enabled</span>
               </div>
               <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80">
                 Edit Pin
               </button>
             </div>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-outline_variant/10 flex justify-between items-center">
            <button type="button" className="text-xs font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-widest hover:text-on_surface dark:hover:text-[#e8eaf0] dark:text-[#e8eaf0] transition-colors leading-[48px]">
              Save As Draft
            </button>
            <Button 
              type="submit" 
              disabled={!isValid}
              className="h-12 px-8 bg-primary text-on_primary shadow-floating font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue To Documents <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Info Cards Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mb-4">
            <CheckCircle2 size={12} />
          </div>
          <h4 className="font-bold text-on_surface dark:text-[#e8eaf0] mb-3 text-sm">Regulatory Compliance</h4>
          <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] leading-relaxed">
            All submissions are cross-referenced with regional land registries automatically via <a href="#" className="text-primary hover:underline">API v2.4</a>.
          </p>
        </div>

        <div className="bg-[#835500]/5 border border-[#835500]/10 rounded-2xl p-6">
          <div className="w-6 h-6 rounded-full bg-[#835500] flex items-center justify-center text-white mb-4">
            <Shield size={12} />
          </div>
          <h4 className="font-bold text-on_surface dark:text-[#e8eaf0] mb-3 text-sm">Immutable Records</h4>
          <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] leading-relaxed">
            Data submitted here is hashed and prepared for the Ethereum Mainnet ledger.
          </p>
        </div>

        <div className="bg-surface_container_low dark:bg-[#161b27] border border-outline_variant/10 rounded-2xl p-6">
          <div className="w-6 h-6 rounded-full bg-on_surface_variant flex items-center justify-center text-white mb-4">
            <Clock size={12} />
          </div>
          <h4 className="font-bold text-on_surface dark:text-[#e8eaf0] mb-3 text-sm">Need Help?</h4>
          <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] leading-relaxed">
            Our legal auditors are available 24/7 to help you with property classification.
          </p>
        </div>
      </div>

    </div>
  );
}
