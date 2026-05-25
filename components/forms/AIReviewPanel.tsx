"use client";

import { useState, useEffect } from "react";
import ConfidenceBar from "@/components/shared/ConfidenceBar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, AlertTriangle, FileText, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MOCK_DOCS: Array<{
  name: string;
  docType: string;
  score: number;
  fields: Record<string, string>;
  fraudFlags: string[];
}> = [];

export default function AIReviewPanel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 py-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-sm font-bold text-on_surface_variant dark:text-muted-foreground uppercase tracking-widest">
            AI Extraction in progress…
          </p>
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const hasDocs = MOCK_DOCS.length > 0;
  const overallScore = hasDocs
    ? Math.round(MOCK_DOCS.reduce((sum, doc) => sum + doc.score, 0) / MOCK_DOCS.length)
    : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_400px] gap-8">
      {/* Left: doc result cards */}
      <div className="space-y-6">
        {!hasDocs ? (
          <Card className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-semibold text-on_surface dark:text-[#e8eaf0]">No AI results yet</p>
              <p className="text-xs text-on_surface_variant dark:text-muted-foreground mt-1">
                Documents will appear here after extraction completes.
              </p>
            </CardContent>
          </Card>
        ) : (
          MOCK_DOCS.map((doc) => (
            <Card
              key={doc.docType}
              className="rounded-2xl border-stone/50 dark:bg-card dark:border-white/5 overflow-hidden transition-all hover:border-primary/20"
            >
              <CardContent className="p-0">
                <div className="p-6 border-b border-stone/20 dark:border-white/5 flex items-center justify-between gap-4 bg-sand/20 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-on_surface dark:text-[#e8eaf0]">{doc.docType}</p>
                      <p className="text-[10px] font-bold text-on_surface_variant dark:text-muted-foreground uppercase tracking-widest opacity-60 font-mono">{doc.name}</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-xl px-3 py-1 font-black shrink-0",
                      doc.score > 80
                        ? "bg-success/10 text-success border-success/20"
                        : doc.score >= 50
                          ? "bg-secondary/10 text-secondary border-secondary/20"
                          : "bg-error/10 text-error border-error/20"
                    )}
                  >
                    {doc.score}%
                  </Badge>
                </div>

                <div className="p-6 space-y-6">
                  <ConfidenceBar score={doc.score} showLabel={false} />

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(doc.fields).map(([key, val]) => (
                      <div key={key}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-muted-foreground opacity-60 mb-1">{key}</p>
                        <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">{val}</p>
                      </div>
                    ))}
                  </div>

                  {doc.fraudFlags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-stone/20 dark:border-white/5">
                      {doc.fraudFlags.map((flag) => (
                        <Badge key={flag} variant="rejected" className="rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          ⚠ {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Right: summary card */}
      <div className="space-y-6 sticky top-6 h-fit">
        <Card className="rounded-2xl border-none bg-primary shadow-floating overflow-hidden relative">
          <CardContent className="p-8 text-on_primary relative z-10">
            <div className="flex items-center gap-2 mb-10 opacity-70">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Audit</span>
            </div>

            <div className="text-center mb-10">
              <p className="text-[4rem] font-black font-display leading-none tracking-tighter">
                {overallScore}%
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-4">Total Confidence Score</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm flex items-center justify-center gap-3">
              <ShieldCheck size={20} />
              <span className="text-xs font-black uppercase tracking-widest">
                {hasDocs ? "Documents Validated" : "Awaiting Documents"}
              </span>
            </div>

            {hasDocs ? (
              <div className="space-y-4 mt-10">
                {MOCK_DOCS.map((doc) => (
                  <div key={doc.docType} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                      <span>{doc.docType}</span>
                      <span>{doc.score}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${doc.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] font-bold text-center mt-10 opacity-50 uppercase tracking-widest">
                No AI documents processed yet
              </p>
            )}
          </CardContent>
          {/* subtle shape */}
          <div className="absolute right-[-10%] top-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </Card>
      </div>
    </div>
  );
}
