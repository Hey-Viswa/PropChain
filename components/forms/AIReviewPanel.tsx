"use client";

import { useState, useEffect } from "react";
import { useMintStore } from "@/store/useMintStore";
import ConfidenceBar from "@/components/shared/ConfidenceBar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FraudFlag {
  code: string;
  severity: "low" | "medium" | "high";
  message: string;
}
interface VerifyResult {
  overallScore: number;
  decision: "auto_pass" | "review" | "reject";
  fields: Record<string, string | number | null>;
  fraudFlags: FraudFlag[];
}

/** Build a deed-like text from the entered details so the AI pipeline has
 *  something concrete to extract and cross-check. */
function buildDocText(d: {
  ulpin: string; address: string; state: string; district: string;
  area: number | null; type: string;
}) {
  return [
    "SALE DEED",
    `Property Address: ${[d.address, d.district, d.state].filter(Boolean).join(", ")}`,
    `ULPIN: ${d.ulpin}`,
    d.area ? `Area: ${d.area} sq ft` : "",
    `Type: ${d.type}`,
  ].filter(Boolean).join("\n");
}

const FIELD_LABELS: Record<string, string> = {
  ulpin: "ULPIN",
  areaSqft: "Area (sq ft)",
  propertyAddress: "Property Address",
  sellerName: "Seller",
  buyerName: "Buyer",
  registrationDate: "Registration Date",
  stampDutyValue: "Stamp Duty",
};

export default function AIReviewPanel() {
  const details = useMintStore((s) => s.details);
  const setAIResults = useMintStore((s) => s.setAIResults);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = useMintStore.getState().details;
    const text = buildDocText(d);
    setLoading(true);
    fetch("/api/ai/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, formUlpin: d.ulpin, formArea: d.area ?? undefined }),
    })
      .then((r) => r.json())
      .then((data: VerifyResult & { error?: string }) => {
        if (data.error) { setError(data.error); return; }
        setResult(data);
        setAIResults({ overallScore: data.overallScore, documents: [] });
      })
      .catch(() => setError("AI verification service unavailable."))
      .finally(() => setLoading(false));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 py-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-sm font-bold text-on_surface_variant dark:text-muted-foreground uppercase tracking-widest">
            Running AI verification…
          </p>
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
        <CardContent className="p-8 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-secondary mx-auto" />
          <p className="font-bold text-on_surface dark:text-[#e8eaf0]">AI verification unavailable</p>
          <p className="text-sm text-on_surface_variant dark:text-muted-foreground">
            {error ?? "Could not score this submission."} You can still continue to review &amp; sign.
          </p>
        </CardContent>
      </Card>
    );
  }

  const score = result.overallScore;
  const decisionLabel =
    result.decision === "auto_pass" ? "Documents Validated"
      : result.decision === "review" ? "Needs Manual Review"
      : "High-Risk — Flagged";

  const extractedEntries = Object.entries(result.fields).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_400px] gap-8">
      {/* Extracted fields */}
      <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-stone/20 dark:border-white/5 flex items-center justify-between gap-4 bg-sand/20 dark:bg-white/[0.02]">
            <div>
              <p className="text-base font-bold text-on_surface dark:text-[#e8eaf0]">Extracted Fields</p>
              <p className="text-[10px] font-bold text-on_surface_variant dark:text-muted-foreground uppercase tracking-widest opacity-60">
                Parsed from your submission
              </p>
            </div>
            <Badge className={cn("rounded-xl px-3 py-1 font-black shrink-0",
              score > 80 ? "bg-success/10 text-success border-success/20"
                : score >= 50 ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-error/10 text-error border-error/20")}>
              {score}%
            </Badge>
          </div>

          <div className="p-6 space-y-6">
            <ConfidenceBar score={score} showLabel={false} />

            {extractedEntries.length === 0 ? (
              <p className="text-sm text-on_surface_variant dark:text-muted-foreground italic">
                No fields could be extracted. Make sure the property details are filled in.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {extractedEntries.map(([key, val]) => (
                  <div key={key}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground opacity-60 mb-1">
                      {FIELD_LABELS[key] ?? key}
                    </p>
                    <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">{String(val)}</p>
                  </div>
                ))}
              </div>
            )}

            {result.fraudFlags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-stone/20 dark:border-white/5">
                {result.fraudFlags.map((flag) => (
                  <Badge key={flag.code} variant="rejected" className="rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest" title={flag.message}>
                    ⚠ {flag.code.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary card */}
      <div className="space-y-6 sticky top-6 h-fit">
        <Card className="rounded-2xl border-none bg-primary shadow-floating overflow-hidden relative">
          <CardContent className="p-8 text-on_primary relative z-10">
            <div className="flex items-center gap-2 mb-10 opacity-70">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Verification</span>
            </div>

            <div className="text-center mb-10">
              <p className="text-[4rem] font-black font-display leading-none tracking-tighter">{score}%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-4">Confidence Score</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-3">
              {result.decision === "reject" ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
              <span className="text-xs font-black uppercase tracking-widest">{decisionLabel}</span>
            </div>

            <p className="text-[10px] font-bold text-center mt-10 opacity-50 uppercase tracking-widest">
              {result.fraudFlags.length === 0
                ? "✓ No Fraud Signals Identified"
                : `⚠ ${result.fraudFlags.length} signal${result.fraudFlags.length === 1 ? "" : "s"} flagged`}
            </p>
          </CardContent>
          <div className="absolute right-[-10%] top-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </Card>
      </div>
    </div>
  );
}
