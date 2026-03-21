import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  PropertyStatus,
  { label: string; variant: string }
> = {
  verified: { label: "Verified", variant: "verified" },
  awaiting_oracle: { label: "Awaiting Oracle", variant: "awaiting_oracle" },
  pending_kyc: { label: "Pending KYC", variant: "pending" },
  needs_review: { label: "Needs Review", variant: "needs_review" },
  ai_parsing: { label: "AI Parsing", variant: "ai_parsing" },
  rejected: { label: "Rejected", variant: "rejected" },
  transferred: { label: "Transferred", variant: "transferred" },
};

interface StatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  const customClasses: string[] = [];
  if (status === 'verified') customClasses.push('dark:bg-[#0a2e1a] dark:text-[#4ade80]');
  if (status === 'awaiting_oracle') customClasses.push('dark:bg-[#1a2d4d] dark:text-[#6b9eff]', 'animate-pulse');
  if (status === 'needs_review') customClasses.push('dark:bg-[#3d2800] dark:text-[#ffddb4]');
  if (status === 'rejected') customClasses.push('dark:bg-[#2d0a0a] dark:text-[#f87171]');
  if (status === 'transferred') customClasses.push('dark:bg-[#1c2333] dark:text-[#9ba3b8]');
  if (status === 'ai_parsing') customClasses.push('dark:bg-[#222b3d] dark:text-[#9ba3b8]', 'animate-[pulse_1s_ease-in-out_infinite]');

  return (
    <Badge
      variant={config.variant as Parameters<typeof Badge>[0]["variant"]}
      className={cn("whitespace-nowrap", ...customClasses, className)}
    >
      {config.label}
    </Badge>
  );
}
