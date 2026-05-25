import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary_fixed text-on_primary_fixed",
        verified: "bg-success_container text-success",
        awaiting_oracle: "bg-primary_fixed text-on_primary_fixed",
        pending: "bg-secondary_fixed text-on_secondary_fixed",
        needs_review: "bg-secondary_fixed text-on_secondary_fixed",
        ai_parsing: "bg-stone/10_high text-on_surface_variant dark:text-[#9ba3b8]",
        rejected: "bg-error_container text-on_error_container",
        transferred: "bg-stone/10 dark:bg-card text-on_surface_variant dark:text-[#9ba3b8]",
        success: "bg-success_container text-success",
        outline: "border border-outline_variant/30 text-on_surface_variant dark:text-[#9ba3b8] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
