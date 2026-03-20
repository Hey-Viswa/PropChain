import { cn } from "@/lib/utils";
import type { AuditEntry } from "@/types";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Lock,
  Unlock,
} from "lucide-react";

const actionConfig: Record<
  AuditEntry["action"],
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  REGISTER: {
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary_fixed",
    label: "Registration Submitted",
  },
  APPROVE: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success_container",
    label: "Oracle Approved",
  },
  TRANSFER: {
    icon: ArrowRight,
    color: "text-primary",
    bg: "bg-primary_fixed",
    label: "Ownership Transfer",
  },
  AI_FLAG: {
    icon: AlertTriangle,
    color: "text-secondary",
    bg: "bg-secondary_fixed",
    label: "AI Flag Raised",
  },
  LIEN_ADDED: {
    icon: Lock,
    color: "text-error",
    bg: "bg-error_container",
    label: "Lien Added",
  },
  LIEN_RELEASED: {
    icon: Unlock,
    color: "text-success",
    bg: "bg-success_container",
    label: "Lien Released",
  },
};

interface AuditTimelineProps {
  entries: AuditEntry[];
  className?: string;
}

export default function AuditTimeline({ entries, className }: AuditTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {entries.map((entry, i) => {
        const config = actionConfig[entry.action];
        const Icon = config.icon;
        const isLast = i === entries.length - 1;

        return (
          <div key={entry.id} className="flex gap-4">
            {/* Spine */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-surface_container mt-1 min-h-[24px]" />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5 xl:pb-6 flex-1 min-w-0", isLast && "pb-0")}>
              <p className="text-title-md font-medium text-on_surface">
                {config.label}
              </p>
              <p className="text-body-md text-on_surface_variant mt-0.5 leading-relaxed">
                {entry.note}
              </p>
              <p className="text-label-sm text-on_surface_variant/70 mt-1 font-mono">
                {entry.actor} · {entry.timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
