import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types";

const statusConfig: Record<PropertyStatus, { label: string; bg: string; text: string }> = {
  verified:        { label: "Verified",       bg: "bg-success_container dark:bg-[#0a2e1a]", text: "text-success dark:text-[#4ade80]" },
  awaiting_oracle: { label: "Awaiting Oracle", bg: "bg-primary_fixed dark:bg-[#3D1F10]",    text: "text-primary dark:text-[#E89874]" },
  pending_kyc:     { label: "Pending KYC",     bg: "bg-warning_container dark:bg-[#3d2800]", text: "text-warning dark:text-[#ffddb4]" },
  needs_review:    { label: "Needs Review",    bg: "bg-warning_container dark:bg-[#3d2800]", text: "text-warning dark:text-[#ffddb4]" },
  ai_parsing:      { label: "AI Parsing",      bg: "bg-sand dark:bg-[#1a1916]",              text: "text-on_surface_variant dark:text-[#9b9690]" },
  rejected:        { label: "Rejected",        bg: "bg-error_container dark:bg-[#2d0a0a]",   text: "text-error dark:text-[#f87171]" },
  transferred:     { label: "Transferred",     bg: "bg-stone dark:bg-[#1a1916]",             text: "text-on_surface_variant dark:text-[#9b9690]" },
};

interface StatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.needs_review;
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-[9px] py-[3px]",
        "text-[10px] font-semibold uppercase tracking-[0.04em]",
        config.bg, config.text,
        status === "awaiting_oracle" && "animate-pulse",
        status === "ai_parsing" && "animate-[pulse_1s_ease-in-out_infinite]",
        className
      )}
    >
      {config.label}
    </span>
  );
}
