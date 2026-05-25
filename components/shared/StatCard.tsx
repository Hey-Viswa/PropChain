import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
}

export default function StatCard({ label, value, accentColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1916] rounded-xl p-5 border border-stone dark:border-[#2a2520]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-on_surface_variant dark:text-[#9b9690] mb-2.5">{label}</p>
      <p
        className={cn(
          "text-headline-lg font-display tracking-tight",
          accentColor ?? "text-on_surface dark:text-[#e8e6e2]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
