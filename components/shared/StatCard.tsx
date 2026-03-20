import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
}

export default function StatCard({ label, value, accentColor }: StatCardProps) {
  return (
    <div className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 2xl:p-8">
      <p className="text-body-md text-on_surface_variant mb-2">{label}</p>
      <p
        className={cn(
          "text-headline-lg font-semibold font-display",
          accentColor ?? "text-on_surface"
        )}
      >
        {value}
      </p>
    </div>
  );
}
