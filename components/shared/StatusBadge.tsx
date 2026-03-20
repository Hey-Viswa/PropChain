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
  return (
    <Badge
      variant={config.variant as Parameters<typeof Badge>[0]["variant"]}
      className={cn("whitespace-nowrap", className)}
    >
      {config.label}
    </Badge>
  );
}
