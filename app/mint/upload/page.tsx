"use client";

import { useEffect, useState, useRef } from "react";
import { useMintStore } from "@/store/useMintStore";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Cloud, ScanBarcode, ArrowRight, ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MintStep2() {
  const { setStep, uploadedDocs, addDoc, removeDoc, aiResults, setAIResults, details } = useMintStore();
  const [isAILoading, setIsAILoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStep(2);
  }, [setStep]);

  // Trigger AI analysis when at least 2 docs are uploaded
  useEffect(() => {
    if (uploadedDocs.length >= 2 && !aiResults && !isAILoading) {
      setIsAILoading(true);
      const timer = setTimeout(() => {
        setAIResults({
          overallScore: 84,
          documents: [
            {
              name: uploadedDocs[0]?.name ?? "sale_deed.pdf",
              score: 87,
              fields: {
                "Seller Name": "Rajesh Kumar",
                "Buyer Name": "Priya Sharma",
                "Property Address": details.address || "12, Shivaji Nagar, Pune",
                "ULPIN": details.ulpin || "MH0123456789",
                "Date": "14 Jan 2025",
                "Stamp Duty": "₹84,000",
              },
            },
            {
              name: uploadedDocs[1]?.name ?? "aadhaar.pdf",
              score: 91,
              fields: {
                "Name": "Priya Sharma",
                "ID Number": "XXXX-XXXX-4521",
                "DOB": "12 Aug 1990",
                "Address": details.address || "12, Shivaji Nagar, Pune",
              },
            },
            {
              name: uploadedDocs[2]?.name ?? "survey.pdf",
              score: 73,
              fields: {
                "Plot Number": "44/B",
                "Area": details.area ? `${details.area} sq ft` : "1200 sq ft",
                "Tehsil": details.district || "Haveli",
                "Revenue Officer": "P.K. Deshmukh",
              },
            },
          ],
        });
        setIsAILoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadedDocs, aiResults, isAILoading, setAIResults, details]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const docType =
      uploadedDocs.length === 0 ? "sale_deed" : uploadedDocs.length === 1 ? "gov_id" : "survey";
    addDoc({ name: file.name, size: file.size, docType });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full flex flex-col items-center max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mt-4">
        <h1 className="text-[34px] font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight mb-4">Register Property Asset</h1>
        <p className="text-on_surface_variant dark:text-[#9ba3b8] text-[15px] leading-relaxed">
          Upload your legal property deed. Our AI engine will verify ownership history<br className="hidden md:block" /> and extract essential metadata for the minting process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 xl:gap-12 w-full">
        {/* Left Col: Upload Zone */}
        <div className="border-2 border-dashed border-[#80a9e2] rounded-[32px] p-10 xl:p-12 flex flex-col items-center justify-center text-center bg-[#f9fbff] min-h-[480px] shadow-[inset_0_4px_24px_rgba(0,80,178,0.02)]">
          {uploadedDocs.length > 0 ? (
            <div className="w-full max-w-md flex flex-col gap-4 text-left">
              <h3 className="text-[20px] font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Uploaded Documents</h3>
              {uploadedDocs.map((doc, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-outline_variant/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-on_surface dark:text-[#e8eaf0]">{doc.name}</p>
                      <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8]">{(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.docType}</p>
                    </div>
                  </div>
                  <button onClick={() => removeDoc(doc.name)} className="text-on_surface_variant dark:text-[#9ba3b8] hover:text-error transition-colors p-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="mt-4 flex justify-center w-full">
                <input type="file" className="hidden" id="file-upload" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-surface_container_low dark:bg-[#161b27] text-on_surface dark:text-[#e8eaf0] hover:bg-surface_container_high shadow-none font-semibold">
                  <Plus className="w-4 h-4 mr-2" /> Add Another File
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-[#e6eeff] flex items-center justify-center mb-6 shadow-sm border border-[#cce0ff]">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-[22px] font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight mb-3">Import Source Document</h3>
              <p className="text-on_surface_variant dark:text-[#9ba3b8] mb-10 max-w-[340px] text-[15px] leading-relaxed">
                Drag and drop your PDF, TIFF, or JPEG file here, or click to browse files from your computer.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <input type="file" className="hidden" id="file-upload-init" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-primary/95 text-on_primary shadow-md h-12 px-8 rounded-md w-full sm:w-auto font-semibold">
                  <Plus className="w-5 h-5 mr-2" /> Select File
                </Button>
                <Button variant="outline" className="bg-white border-border/80 text-primary shadow-sm h-12 px-8 rounded-md w-full sm:w-auto font-semibold hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#161b27]">
                  Use Cloud Drive
                </Button>
              </div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-on_surface_variant/60 font-bold mt-auto pt-10">
                MAX FILE SIZE: 50MB | SUPPORTED: .PDF, .JPG, .PNG
              </p>
            </>
          )}
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
              <h3 className="text-[28px] font-display font-bold text-white mb-6 leading-[1.15] max-w-[280px]">
                {isAILoading ? "Our AI is Reviewing Your Document..." : aiResults ? "Review Complete. Confidence is High." : "Upload documents to begin AI review"}
              </h3>
              
              <div className="bg-[#0050b2]/80 rounded-2xl p-5 border border-white/10 mb-8 backdrop-blur-md flex items-start gap-4 shadow-inner">
                <div className="mt-0.5 shrink-0 bg-white/15 p-2 rounded-lg border border-white/20">
                  {isAILoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <ScanBarcode className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1.5 text-sm leading-tight">
                    {aiResults ? `We've extracted ${Object.keys(aiResults.documents[0].fields).length * aiResults.documents.length} key property details` : "Awaiting documents..."}
                  </h4>
                  <p className="text-white/70 text-[11px] leading-relaxed">Matching against national registry database...</p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-auto pt-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-[0.15em] text-white/70 uppercase">CONFIDENCE SCORE</p>
                  <p className="text-[48px] font-bold font-display text-white leading-none tracking-tight">
                    {isAILoading ? "--%" : aiResults ? `${aiResults.overallScore}%` : "0%"}
                  </p>
                </div>
                <div className="flex -space-x-3 pb-1">
                  <div className="w-10 h-10 rounded-full border-[3px] border-[#1868db] bg-white overflow-hidden shadow-sm flex items-center justify-center z-10 relative">
                    {/* Placeholder for small document/avatar graphic */}
                    <div className="w-full h-full bg-[#e6eeff] flex items-center justify-center text-[#1868db] font-bold text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://images.unsplash.com/photo-1549487935-86f376483569?w=64&h=64&fit=crop" className="w-full h-full object-cover opacity-80" alt="" />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-[3px] border-[#1868db] bg-[#0c449c] overflow-hidden flex items-center justify-center text-white/90 z-0 relative">
                    <Cloud className="w-4 h-4" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Preview */}
          {aiResults && (
            <div className="mt-2 text-left">
               <h4 className="text-[11px] font-bold tracking-[0.15em] text-on_surface_variant/60 uppercase mb-3 ml-1">EXTRACTION PREVIEW</h4>
               <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-2xl shadow-sm border border-border/40 overflow-hidden">
                  {Object.entries(aiResults.documents[0].fields).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-3.5 px-5 border-b border-border/30 bg-surface_container_lowest dark:bg-[#131820] last:border-0">
                       <span className="text-[13px] font-semibold text-on_surface_variant dark:text-[#9ba3b8]">{key}</span>
                       <span className="text-[15px] font-bold font-display text-on_surface dark:text-[#e8eaf0] line-clamp-1 text-right max-w-[200px]" title={val}>{val}</span>
                    </div>
                  ))}
               </div>
               <a href="#" className="inline-flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors mt-4 ml-1">
                  View all extracted fields <ArrowRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
               </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between w-full mt-12 pt-8 border-t border-border/40">
        <Link href="/mint">
          <Button variant="ghost" className="text-on_surface dark:text-[#e8eaf0] font-semibold hover:bg-surface_container_low dark:hover:bg-[#161b27] dark:bg-[#161b27] px-1 hover:transparent">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Back to Details
          </Button>
        </Link>
        <div className="flex gap-4">
          <Button variant="secondary" className="bg-surface_container dark:bg-[#1c2333] text-on_surface_variant dark:text-[#9ba3b8] hover:bg-surface_container_high h-11 px-6 font-semibold shadow-sm">
            Save Draft
          </Button>
          <Link href="/mint/review" aria-disabled={uploadedDocs.length < 2 || isAILoading}>
            <Button
              disabled={uploadedDocs.length < 2 || isAILoading}
              className="bg-primary hover:bg-primary/95 text-on_primary shadow-md h-11 px-8 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Minting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

