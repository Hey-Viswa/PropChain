import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  score: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

function getColor(score: number) {
  if (score > 80) return { bar: "bg-success", text: "text-success" };
  if (score >= 50) return { bar: "bg-secondary", text: "text-secondary" };
  return { bar: "bg-error", text: "text-error" };
}

export default function ConfidenceBar({
  score,
  label,
  showLabel = true,
  className,
}: ConfidenceBarProps) {
  const { bar, text } = getColor(score);

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8]">{label}</span>
          )}
          <span className={cn("text-label-sm font-medium ml-auto", text)}>
            {score}%
          </span>
        </div>
      )}
      <div className="bg-surface_container dark:bg-[#1c2333] rounded-full h-2 w-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            "duration-700 ease-out",
            bar
          )}
          style={{
            width: `${Math.min(100, Math.max(0, score))}%`,
            transition: "width 700ms cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        />
      </div>
    </div>
  );
}
