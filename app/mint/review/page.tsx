"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMintStore } from "@/store/useMintStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { usePropertyContract } from "@/hooks/usePropertyContract";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";

export default function MintStep4() {
  const router = useRouter();
  const { setStep, details, uploadedDocs, reset, aiResults } = useMintStore();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { mintProperty } = usePropertyContract();
  const { address } = useWallet();

  useEffect(() => {
    setStep(4);
  }, [setStep]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Step 1: Save to MongoDB
      const regRes = await fetch("/api/properties/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress:   address,
          ulpin:           details.ulpin,
          physicalAddress: details.address,
          areaSqFt:        details.area,
          propertyType:    details.type,
          description:     details.description,
          documentUrl:     uploadedDocs[0]?.name ?? "",
        }),
      });
      const regData = await regRes.json();
      if (!regData.success) throw new Error(regData.error || "Registration failed");

      // Step 2: Call contract — mint NFT
      const txHash = await mintProperty(
        details.ulpin!,
        "QmMockHash_" + details.ulpin, // Phase 3: real IPFS hash
        details.address!,
        details.area!
      );

      // Step 3: Confirm in MongoDB with txHash
      // tokenId comes from contract event — for now store txHash only
      await fetch("/api/properties/confirm-mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId: regData.id, tokenId: 0, txHash }),
      });

      reset();
      toast({ title: "Submitted!", description: "Awaiting Oracle approval." });
      router.push("/properties");
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message ?? "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const docCount = uploadedDocs.length;

  if (!details.ulpin) {
    return (
      <div className="bg-surface_container_lowest rounded-xl p-8 text-center max-w-md mx-auto space-y-4 border border-outline_variant/20 shadow-sm mt-12">
        <p className="text-title-md font-semibold text-on_surface">Incomplete Data</p>
        <p className="text-body-md text-on_surface_variant">Please complete Step 1 first.</p>
        <Link href="/mint/details">
          <Button className="w-full">Go to Step 1</Button>
        </Link>
      </div>
    );
  }

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
            {uploadedDocs.map((doc, i) => {
              const aiDoc = aiResults?.documents?.find(d => d.name === doc.name);
              return (
                <li
                  key={i}
                  className="text-body-md text-on_surface_variant flex items-center justify-between before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2"
                >
                  <span>{doc.name}</span>
                  {aiDoc && <span className="text-xs font-semibold text-success">AI Score: {aiDoc.score}%</span>}
                </li>
              );
            })}
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
              {aiResults ? `${aiResults.overallScore}%` : "Pending"}
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
          <Link href="/mint/upload" aria-disabled={submitting}>
            <Button
              variant="ghost"
              className="w-full"
              disabled={submitting}
            >
              Cancel
            </Button>
          </Link>
          <p className="text-[0.7rem] text-on_surface_variant text-center leading-relaxed">
            This initiates a mock transaction on Polygon Mumbai testnet. No real assets will be transferred.
          </p>
        </div>
      </div>
    </div>
  );
}
