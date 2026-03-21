import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
}

export default function StatCard({ label, value, accentColor }: StatCardProps) {
  return (
    <div className="bg-surface_container_lowest dark:bg-[#131820] rounded-xl p-5 xl:p-6 2xl:p-8">
      <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8] mb-2">{label}</p>
      <p
        className={cn(
          "text-headline-lg font-semibold font-display",
          accentColor ?? "text-on_surface dark:text-[#e8eaf0]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
