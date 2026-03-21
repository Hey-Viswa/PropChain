"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const STEPS = [
  { id: 1, label: "Property Details" },
  { id: 2, label: "Upload Documents" },
  { id: 3, label: "AI Verification" },
  { id: 4, label: "Review & Sign" },
];

export default function StepperHeader() {
  const pathname = usePathname();
  let currentStep = 1;
  if (pathname.includes("/upload")) currentStep = 2;
  else if (pathname.includes("/review")) currentStep = 3;

  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isUpcoming = step.id > currentStep;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-start flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all",
                  isCompleted && "bg-success text-white",
                  isActive &&
                    "bg-primary text-on_primary shadow-[0_0_0_4px_rgba(0,80,178,0.12)]",
                  isUpcoming &&
                    "border-2 border-outline_variant text-on_surface_variant dark:text-[#9ba3b8] bg-transparent"
                )}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "text-[0.68rem] font-medium mt-1.5 whitespace-nowrap hidden md:block",
                  isActive && "text-primary",
                  (isCompleted || isUpcoming) && "text-on_surface_variant dark:text-[#9ba3b8]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-2 mt-4 rounded-full",
                  isCompleted ? "bg-success/40" : "bg-outline_variant/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
