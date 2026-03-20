"use client";

import { useEffect } from "react";
import { useMintStore } from "@/store/useMintStore";
import AIReviewPanel from "@/components/forms/AIReviewPanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MintStep3() {
  const { setStep } = useMintStore();

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  return (
    <div className="space-y-6 xl:space-y-8">
      <AIReviewPanel />

      <div className="flex justify-between pt-4 mt-8 border-t border-outline_variant/20">
        <Link href="/mint/upload">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/mint/review">
          <Button>Next: Review & Sign →</Button>
        </Link>
      </div>
    </div>
  );
}
