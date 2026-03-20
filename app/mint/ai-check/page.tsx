"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMintStore } from "@/store/useMintStore";
import AIReviewPanel from "@/components/forms/AIReviewPanel";
import { Button } from "@/components/ui/button";

export default function MintStep3() {
  const router = useRouter();
  const { setStep } = useMintStore();

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  return (
    <div className="space-y-6 xl:space-y-8">
      <AIReviewPanel />

      <div className="flex justify-between pt-4 mt-8 border-t border-outline_variant/20">
        <Button variant="ghost" onClick={() => router.push("/mint/upload")}>
          ← Back
        </Button>
        <Button onClick={() => router.push("/mint/review")}>
          Next: Review & Sign →
        </Button>
      </div>
    </div>
  );
}
