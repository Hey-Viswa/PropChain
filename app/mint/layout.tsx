"use client";

import StepperHeader from "@/components/shared/StepperHeader";

export default function MintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 xl:space-y-8">
      <StepperHeader />
      <div className="pt-2">{children}</div>
    </div>
  );
}
