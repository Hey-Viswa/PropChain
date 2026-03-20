"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMintStore } from "@/store/useMintStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function MintStep4() {
  const router = useRouter();
  const { setStep, details, uploadedDocs, reset } = useMintStore();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStep(4);
  }, [setStep]);

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      reset();
      router.push("/properties");
      toast({
        title: "Property submitted for Oracle approval.",
        description: "Your registration has been sent to the network.",
      });
    }, 1500);
  }

  const docCount = uploadedDocs.length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_420px] gap-6 xl:gap-8">
      {/* Left: Summary */}
      <div className="bg-surface_container_lowest rounded-xl p-6 xl:p-8 space-y-5 shadow-card h-fit">
        <p className="text-headline-md font-semibold text-on_surface font-display">
          Review Your Submission
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
          {[
            ["ULPIN", details.ulpin || "—"],
            ["Property Address", details.address || "—"],
            ["State", details.state || "—"],
            ["District", details.district || "—"],
            ["Area", `${details.area || 0} sq ft`],
            ["Property Type", details.type || "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-label-sm text-on_surface_variant mb-0.5">{label}</p>
              <p className="text-body-md text-on_surface font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <p className="text-title-md font-medium text-on_surface mb-3 font-display">
            Documents ({docCount})
          </p>
          <ul className="space-y-2">
            {uploadedDocs.map((doc, i) => (
              <li
                key={i}
                className="text-body-md text-on_surface_variant flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2"
              >
                {doc.name}
              </li>
            ))}
            {docCount === 0 && (
              <li className="text-body-md text-on_surface_variant">No documents attached.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Right: Sticky Transaction Card */}
      <div className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 sticky top-24 h-fit shadow-card space-y-4">
        <p className="text-title-md font-semibold text-on_surface font-display">
          Transaction Summary
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant">Documents</span>
            <span className="text-body-md font-medium text-on_surface">
              {docCount} files
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant">AI Confidence</span>
            <Badge className="bg-success_container text-success rounded-full py-0.5">
              84%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant">Network</span>
            <span className="text-body-md font-medium text-on_surface">
              Polygon Mumbai
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-outline_variant/20">
            <span className="text-body-md text-on_surface_variant">Est. Gas</span>
            <span className="text-body-md font-medium text-on_surface_variant">
              ~0.001 MATIC
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            variant="default"
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…
              </>
            ) : (
              "Sign & Submit to Blockchain"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/mint/upload")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <p className="text-[0.7rem] text-on_surface_variant text-center leading-relaxed">
            This initiates a mock transaction on Polygon Mumbai testnet. No real assets will be transferred.
          </p>
        </div>
      </div>
    </div>
  );
}
