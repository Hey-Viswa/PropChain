"use client";

import { useState, useEffect } from "react";
import ConfidenceBar from "@/components/shared/ConfidenceBar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DOCS = [
  {
    name: "sale_deed.pdf",
    docType: "Sale Deed",
    score: 87,
    fields: {
      "Seller Name": "Vikram Mehta",
      "Buyer Name": "Aryan Sharma",
      "Property Address": "12, Shivaji Nagar, Pune",
      "ULPIN": "MH0123456789",
      "Registration Date": "14 Jan 2025",
      "Stamp Duty": "₹72,000",
    },
    fraudFlags: [] as string[],
  },
  {
    name: "aadhaar.pdf",
    docType: "Government ID",
    score: 91,
    fields: {
      "Full Name": "Aryan Sharma",
      "ID Type": "Aadhaar Card",
      "ID Number": "XXXX XXXX 4521",
      "Date of Birth": "12 Aug 1990",
      "Gender": "Male",
    },
    fraudFlags: [] as string[],
  },
  {
    name: "survey_record.pdf",
    docType: "Survey Record",
    score: 73,
    fields: {
      "Plot Number": "42/B/7",
      "Area (sq ft)": "1,200",
      "Land Type": "Residential",
      "Mutation Date": "02 Feb 2025",
    },
    fraudFlags: [] as string[],
  },
];

export default function AIReviewPanel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <p className="text-body-md text-on_surface_variant text-center py-2">
          AI is analysing your documents…
        </p>
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  const overallScore = 84;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_400px] gap-6 xl:gap-8">
      {/* Left: doc result cards */}
      <div className="space-y-4">
        {MOCK_DOCS.map((doc) => (
          <div
            key={doc.docType}
            className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-title-md font-medium text-on_surface">{doc.docType}</p>
                <p className="text-label-sm text-on_surface_variant font-mono">{doc.name}</p>
              </div>
              <Badge
                className={cn(
                  "rounded-full shrink-0",
                  doc.score > 80
                    ? "bg-success_container text-success"
                    : doc.score >= 50
                      ? "bg-secondary_fixed text-on_secondary_fixed"
                      : "bg-error_container text-on_error_container"
                )}
              >
                {doc.score}%
              </Badge>
            </div>

            <ConfidenceBar score={doc.score} showLabel={false} />

            {/* Extracted fields – 2-col, NO borders */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {Object.entries(doc.fields).map(([key, val]) => (
                <div key={key}>
                  <p className="text-label-sm text-on_surface_variant">{key}</p>
                  <p className="text-body-md font-medium text-on_surface">{val}</p>
                </div>
              ))}
            </div>

            {doc.fraudFlags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {doc.fraudFlags.map((flag) => (
                  <Badge key={flag} className="bg-error_container text-on_error_container rounded-full">
                    ⚠ {flag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: summary card */}
      <div className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 sticky top-6 space-y-5 h-fit">
        <p className="text-title-md font-semibold text-on_surface font-display">
          Verification Summary
        </p>

        {/* Big score */}
        <div className="text-center py-4 xl:py-6">
          <p className="text-[3rem] xl:text-[3.5rem] font-bold font-display text-success leading-none">
            {overallScore}%
          </p>
          <p className="text-body-md text-on_surface_variant mt-2">Overall Confidence</p>
        </div>

        {/* Verdict */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-success_container text-success rounded-full px-4 py-1.5">
            <ShieldCheck size={14} />
            <span className="text-label-sm font-medium">Documents Passed</span>
          </div>
        </div>

        {/* Per-doc mini bars */}
        <div className="space-y-3 pt-1">
          {MOCK_DOCS.map((doc) => (
            <ConfidenceBar key={doc.docType} score={doc.score} label={doc.docType} showLabel />
          ))}
        </div>

        <p className="text-label-sm text-on_surface_variant pt-1">
          ✓ No fraud signals detected
        </p>
      </div>
    </div>
  );
}
