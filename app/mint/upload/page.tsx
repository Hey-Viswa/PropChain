"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMintStore } from "@/store/useMintStore";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Cloud, ScanBarcode, ArrowRight, ArrowLeft } from "lucide-react";

export default function MintStep2() {
  const router = useRouter();
  const { setStep } = useMintStore();

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  return (
    <div className="w-full flex flex-col items-center max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mt-4">
        <h1 className="text-[34px] font-bold font-display text-on_surface tracking-tight mb-4">Register Property Asset</h1>
        <p className="text-on_surface_variant text-[15px] leading-relaxed">
          Upload your legal property deed. Our AI engine will verify ownership history<br className="hidden md:block" /> and extract essential metadata for the minting process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 xl:gap-12 w-full">
        {/* Left Col: Upload Zone */}
        <div className="border-2 border-dashed border-[#80a9e2] rounded-[32px] p-10 xl:p-12 flex flex-col items-center justify-center text-center bg-[#f9fbff] min-h-[480px] shadow-[inset_0_4px_24px_rgba(0,80,178,0.02)]">
          <div className="w-20 h-20 rounded-2xl bg-[#e6eeff] flex items-center justify-center mb-6 shadow-sm border border-[#cce0ff]">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-[22px] font-bold font-display text-on_surface tracking-tight mb-3">Import Source Document</h3>
          <p className="text-on_surface_variant mb-10 max-w-[340px] text-[15px] leading-relaxed">
            Drag and drop your PDF, TIFF, or JPEG file here, or click to browse files from your computer.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button className="bg-primary hover:bg-primary/95 text-white shadow-md h-12 px-8 rounded-lg w-full sm:w-auto font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Select File
            </Button>
            <Button variant="outline" className="bg-white border-border/80 text-primary shadow-sm h-12 px-8 rounded-lg w-full sm:w-auto font-semibold hover:bg-surface_container_low">
              Use Cloud Drive
            </Button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-on_surface_variant/60 font-bold mt-auto pt-10">
            MAX FILE SIZE: 50MB | SUPPORTED: .PDF, .JPG, .PNG
          </p>
        </div>

        {/* Right Col: AI Review & Extraction */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:max-w-none">
          {/* Blue AI Card */}
          <div className="bg-[#1868db] rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-xl border border-[#3b82f6]/30 h-full">
            {/* Subtle glow / light leak background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[64px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0050b2]/40 blur-[48px] rounded-full pointer-events-none -ml-20 -mb-20"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffb703] shadow-[0_0_12px_rgba(255,183,3,0.9)]"></div>
                <span className="text-[10px] font-bold tracking-[0.15em] text-white/90 uppercase">AI ENGINE PROCESSING</span>
              </div>
              <h3 className="text-[28px] font-display font-bold text-white mb-6 leading-[1.15] max-w-[280px]">Our AI is Reviewing Your Document...</h3>
              
              <div className="bg-[#0050b2]/80 rounded-2xl p-5 border border-white/10 mb-8 backdrop-blur-md flex items-start gap-4 shadow-inner">
                <div className="mt-0.5 shrink-0 bg-white/15 p-2 rounded-lg border border-white/20">
                  <ScanBarcode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1.5 text-sm leading-tight">We&apos;ve extracted 12 key property details</h4>
                  <p className="text-white/70 text-[11px] leading-relaxed">Matching against national registry database...</p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-auto pt-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-[0.15em] text-white/70 uppercase">CONFIDENCE SCORE</p>
                  <p className="text-[48px] font-bold font-display text-white leading-none tracking-tight">98.4%</p>
                </div>
                <div className="flex -space-x-3 pb-1">
                  <div className="w-10 h-10 rounded-full border-[3px] border-[#1868db] bg-white overflow-hidden shadow-sm flex items-center justify-center z-10 relative">
                    {/* Placeholder for small document/avatar graphic */}
                    <div className="w-full h-full bg-[#e6eeff] flex items-center justify-center text-[#1868db] font-bold text-xs"><img src="https://images.unsplash.com/photo-1549487935-86f376483569?w=64&h=64&fit=crop" className="w-full h-full object-cover opacity-80" alt="" /></div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-[3px] border-[#1868db] bg-[#0c449c] overflow-hidden flex items-center justify-center text-white/90 z-0 relative">
                    <Cloud className="w-4 h-4" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Preview */}
          <div className="mt-2 text-left">
             <h4 className="text-[11px] font-bold tracking-[0.15em] text-on_surface_variant/60 uppercase mb-3 ml-1">EXTRACTION PREVIEW</h4>
             <div className="bg-surface_container_lowest rounded-2xl shadow-sm border border-border/40 overflow-hidden">
                <div className="flex justify-between items-center py-3.5 px-5 border-b border-border/30 bg-surface_container_lowest">
                   <span className="text-[13px] font-semibold text-on_surface_variant">Parcel ID</span>
                   <span className="text-[15px] font-bold font-display text-primary">#492-9902-AX</span>
                </div>
                <div className="flex justify-between items-center py-3.5 px-5 border-b border-border/30 bg-surface_container_lowest">
                   <span className="text-[13px] font-semibold text-on_surface_variant">Deed Type</span>
                   <span className="text-[15px] font-bold font-display text-on_surface">Warranty Deed</span>
                </div>
                <div className="flex justify-between items-center py-3.5 px-5 bg-surface_container_lowest">
                   <span className="text-[13px] font-semibold text-on_surface_variant">Last Sale Date</span>
                   <span className="text-[15px] font-bold font-display text-on_surface">Oct 12, 2023</span>
                </div>
             </div>
             <a href="#" className="inline-flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors mt-4 ml-1">
                View all extracted fields <ArrowRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
             </a>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between w-full mt-12 pt-8 border-t border-border/40">
        <Button variant="ghost" onClick={() => router.push("/mint")} className="text-on_surface font-semibold hover:bg-surface_container_low px-1 hover:transparent">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
          Back to Details
        </Button>
        <div className="flex gap-4">
          <Button variant="secondary" className="bg-surface_container text-on_surface_variant hover:bg-surface_container_high h-11 px-6 font-semibold shadow-sm">
            Save Draft
          </Button>
          <Button onClick={() => router.push("/mint/review")} className="bg-primary hover:bg-primary/95 text-white shadow-md h-11 px-8 font-semibold">
            Continue to Minting
          </Button>
        </div>
      </div>
    </div>
  );
}
