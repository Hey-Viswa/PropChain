"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { useMintStore } from "@/store/useMintStore";
import { useToast } from "@/hooks/use-toast";
import { usePropertyContract } from "@/hooks/usePropertyContract";
import { useWallet } from "@/hooks/useWallet";
import { useKYC } from "@/hooks/useKYC";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RegisterSuccess = {
  success: true;
  id: string;
  ulpin: string;
  mintStatus: string;
};

export default function MintStep4() {
  const router = useRouter();
  const { setStep, details, uploadedDocs, reset, aiResults } = useMintStore();
  const { toast } = useToast();
  const { address, isConnected, connect, isCorrectNetwork } = useWallet();
  const { kycVerified, isLoading: checking } = useKYC();
  const { mintProperty, mintState, mintError, txHash } = usePropertyContract();
  const [submitting, setSubmitting] = useState(false);
  const [registeredRecordId, setRegisteredRecordId] = useState<string | null>(null);

  useEffect(() => {
    setStep(4);
  }, [setStep]);

  const canSubmit = useMemo(() => {
    if (!isConnected || !isCorrectNetwork) return false;
    if (checking || !kycVerified) return false;
    if (!details.ulpin || !details.address || !details.area || !details.type) return false;
    return !submitting;
  }, [isConnected, isCorrectNetwork, checking, kycVerified, details, submitting]);

  const handleSubmit = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    if (!address) {
      toast({ title: "No wallet connected", variant: "destructive" });
      return;
    }
    if (!isCorrectNetwork) {
      toast({
        title: "Wrong network",
        description: "Please switch to Polygon Mumbai or local Hardhat network.",
        variant: "destructive",
      });
      return;
    }
    if (!kycVerified) {
      toast({
        title: "KYC required",
        description: "Complete KYC before registering property.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const regRes = await fetch("/api/properties/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          ulpin: details.ulpin,
          physicalAddress: details.address,
          areaSqFt: details.area,
          propertyType: details.type,
          description: details.description,
          documentUrl: uploadedDocs[0]?.name ?? "",
        }),
      });
      const regData = (await regRes.json()) as RegisterSuccess | { error?: string };
      if (!regRes.ok || !("success" in regData) || !regData.success) {
        throw new Error((regData as { error?: string }).error ?? "Registration failed");
      }

      setRegisteredRecordId(regData.id);
      await mintProperty({
        recordId: regData.id,
        ulpin: details.ulpin,
        docHash: `QmMockHash_${details.ulpin}`,
        physicalAddress: details.address,
        areaSqFt: details.area!,  // Guaranteed by canSubmit check
      });

      reset();
      toast({
        title: "Submitted successfully",
        description: "Property minted and queued for Oracle approval.",
      });
      router.push("/properties");
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const docCount = uploadedDocs.length;
  const txExplorerHref = txHash ? `https://mumbai.polygonscan.com/tx/${txHash}` : null;

  if (!details.ulpin) {
    return (
      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-8 text-center max-w-md mx-auto space-y-4 border border-outline_variant/20 shadow-sm mt-12">
        <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0]">Incomplete Data</p>
        <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">Please complete Step 1 first.</p>
        <Link href="/mint/details">
          <Button className="w-full">Go to Step 1</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_420px] gap-6 xl:gap-8">
      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-6 xl:p-8 space-y-5 shadow-card h-fit">
        <p className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0] font-display">
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
              <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-0.5">{label}</p>
              <p className="text-body-md text-on_surface dark:text-[#e8eaf0] font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <p className="text-title-md font-medium text-on_surface dark:text-[#e8eaf0] mb-3 font-display">
            Documents ({docCount})
          </p>
          <ul className="space-y-2">
            {uploadedDocs.map((doc, i) => {
              const aiDoc = aiResults?.documents?.find((d) => d.name === doc.name);
              return (
                <li
                  key={i}
                  className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] flex items-center justify-between before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2"
                >
                  <span>{doc.name}</span>
                  {aiDoc && (
                    <span className="text-xs font-semibold text-success">AI Score: {aiDoc.score}%</span>
                  )}
                </li>
              );
            })}
            {docCount === 0 && (
              <li className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
                No documents attached.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6 sticky top-24 h-fit shadow-card space-y-4">
        <p className="text-title-md font-semibold text-on_surface dark:text-[#e8eaf0] font-display">
          Transaction Summary
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">Documents</span>
            <span className="text-body-md font-medium text-on_surface dark:text-[#e8eaf0]">
              {docCount} files
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">AI Confidence</span>
            <Badge className="bg-success_container text-success rounded-full py-0.5">
              {aiResults ? `${aiResults.overallScore}%` : "Pending"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">KYC Status</span>
            <Badge className={kycVerified ? "bg-success_container text-success" : "bg-error_container text-on_error_container"}>
              {checking ? "Checking..." : kycVerified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">Wallet</span>
            <span className="text-xs font-medium text-on_surface dark:text-[#e8eaf0]">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">Mint State</span>
            <Badge>{mintState}</Badge>
          </div>
          {txHash && txExplorerHref && (
            <a
              href={txExplorerHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline"
            >
              View tx hash <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {registeredRecordId && (
            <p className="text-[0.7rem] text-on_surface_variant dark:text-[#9ba3b8]">
              Record ID: {registeredRecordId}
            </p>
          )}
          {mintError && (
            <p className="text-[0.75rem] text-error">{mintError}</p>
          )}
        </div>

        <div className="pt-2 space-y-3">
          <Button
            variant="default"
            className="w-full"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : !isConnected ? (
              "Connect Wallet"
            ) : !kycVerified ? (
              "Complete KYC to Continue"
            ) : (
              "Sign & Submit to Blockchain"
            )}
          </Button>
          <Link href="/mint/upload" aria-disabled={submitting}>
            <Button variant="ghost" className="w-full" disabled={submitting}>
              Cancel
            </Button>
          </Link>
          <p className="text-[0.7rem] text-on_surface_variant dark:text-[#9ba3b8] text-center leading-relaxed">
            This initiates a transaction and persists tx hash + tokenId in your property record.
          </p>
        </div>
      </div>
    </div>
  );
}
