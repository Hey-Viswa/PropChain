"use client";

import { useEffect, useState, useRef } from "react";
import { useMintStore } from "@/store/useMintStore";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Cloud, ScanBarcode, ArrowRight, ArrowLeft, X, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MintStep2() {
  const { setStep, uploadedDocs, addDoc, removeDoc, aiResults, setAIResults, details } = useMintStore();
  const [isAILoading, setIsAILoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStep(2);
  }, [setStep]);

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
    <div className="w-full flex flex-col items-center max-w-5xl mx-auto pb-20 px-6">
      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mt-8">
        <h1 className="text-4xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight mb-4">Verification Audit</h1>
        <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] leading-relaxed font-medium">
          Upload legal deeds for institutional AI verification. Our engine cross-references ownership history with global registries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 xl:gap-12 w-full items-start">
        {/* Left Col: Upload Zone */}
        <Card className="rounded-3xl p-10 xl:p-12 flex flex-col items-center justify-center text-center bg-sand/30 dark:bg-card min-h-[480px] border-2 border-dashed border-stone dark:border-white/10 shadow-sm transition-all hover:border-primary/40">
          {uploadedDocs.length > 0 ? (
            <div className="w-full max-w-md flex flex-col gap-4 text-left">
              <h3 className="text-lg font-bold font-display text-on_surface dark:text-[#e8eaf0] mb-2">Institutional Queue</h3>
              {uploadedDocs.map((doc, i) => (
                <div key={i} className="flex justify-between items-center bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-stone/50 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">{doc.name}</p>
                      <p className="text-[10px] font-bold text-on_surface_variant dark:text-[#9ba3b8] uppercase tracking-widest opacity-60">{(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.docType}</p>
                    </div>
                  </div>
                  <button onClick={() => removeDoc(doc.name)} className="text-on_surface_variant dark:text-[#9ba3b8] hover:text-error transition-colors p-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="mt-4 flex justify-center w-full">
                <input type="file" className="hidden" id="file-upload" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-10 px-6 rounded-xl border-stone dark:border-white/5 text-[10px] font-bold uppercase tracking-widest">
                  <Plus className="w-3.5 h-3.5 mr-2" /> Add Document
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                <Cloud className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display text-on_surface dark:text-[#e8eaf0] tracking-tight mb-3">Initialize Source Audit</h3>
              <p className="text-sm text-on_surface_variant dark:text-[#9ba3b8] mb-10 max-w-[300px] leading-relaxed font-medium">
                Submit high-resolution deeds (PDF/TIFF) for neural extraction and on-chain hashing.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <input type="file" className="hidden" id="file-upload-init" ref={fileInputRef} onChange={handleFileUpload} />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-primary_container text-on_primary shadow-floating h-12 px-10 rounded-xl w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest">
                  <Plus className="w-4 h-4 mr-2" /> Select Files
                </Button>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-on_surface_variant/40 font-bold mt-12">
                Compliance Protocol: 50MB Limit
              </p>
            </>
          )}
        </Card>

        {/* Right Col: AI Review & Extraction */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:max-w-none">
          {/* AI Intelligence Card */}
          <Card className="bg-primary border-none rounded-3xl p-8 flex flex-col shadow-floating relative overflow-hidden h-full min-h-[400px]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">Institutional AI Audit</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-8 leading-tight tracking-tight">
                {isAILoading ? "Verifying Ownership Lineage..." : aiResults ? "Audit Complete. Record Validated." : "Awaiting legal source documents..."}
              </h3>
              
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 mb-10 backdrop-blur-sm flex items-start gap-4">
                <div className="shrink-0 bg-white/20 p-2.5 rounded-xl border border-white/20">
                  {isAILoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <ShieldCheck className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-sm uppercase tracking-wide">
                    {aiResults ? "Entropy Cleared" : "Engine Standby"}
                  </h4>
                  <p className="text-white/60 text-[11px] font-medium leading-relaxed uppercase tracking-wider">Hashed 1:1 on Polygon POS</p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Neural Confidence</p>
                  <p className="text-5xl font-black font-display text-white leading-none tracking-tighter">
                    {isAILoading ? "--%" : aiResults ? `${aiResults.overallScore}%` : "0%"}
                  </p>
                </div>
              </div>
            </div>
            {/* abstract shape */}
            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </Card>

          {/* Extraction Preview */}
          {aiResults && (
            <div className="mt-4 space-y-4 animate-fade-up">
               <h4 className="text-[10px] font-bold tracking-[0.2em] text-on_surface_variant/50 uppercase ml-1">Verified Metadata Extract</h4>
               <Card className="rounded-2xl shadow-sm border-stone/30 dark:bg-card dark:border-white/5 overflow-hidden">
                  {Object.entries(aiResults.documents[0].fields).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-4 px-6 border-b border-stone/20 dark:border-white/5 last:border-0 hover:bg-sand/30 dark:hover:bg-white/[0.01] transition-colors">
                       <span className="text-[11px] font-bold text-on_surface_variant uppercase tracking-wider opacity-60">{key}</span>
                       <span className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] line-clamp-1">{val}</span>
                    </div>
                  ))}
               </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-16 pt-10 border-t border-stone/30 dark:border-white/5 gap-6">
        <Link href="/mint">
          <Button variant="ghost" className="text-on_surface_variant hover:text-primary font-bold uppercase tracking-widest text-[10px] h-10 px-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" strokeWidth={3} />
            Back to Identity
          </Button>
        </Link>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none border-stone dark:border-white/5 text-[10px] font-bold uppercase tracking-widest h-11 px-8 rounded-xl bg-white dark:bg-card shadow-sm">
            Save Protocol
          </Button>
          <Link href="/mint/review" className="flex-1 sm:flex-none" aria-disabled={uploadedDocs.length < 2 || isAILoading}>
            <Button
              disabled={uploadedDocs.length < 2 || isAILoading}
              className="w-full h-11 px-10 bg-primary hover:bg-primary_container text-on_primary shadow-floating font-bold rounded-xl uppercase tracking-widest text-[10px] disabled:opacity-30"
            >
              Confirm & Mint Asset
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
