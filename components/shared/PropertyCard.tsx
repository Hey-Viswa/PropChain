import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-card rounded-2xl p-6",
        "border border-stone dark:border-white/5",
        "hover:-translate-y-1 hover:border-primary/30",
        "transition-all duration-300 ease-out cursor-pointer flex flex-col gap-0 shadow-sm hover:shadow-card"
      )}
    >
      {/* Row 1: Address + Status */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-title-md font-medium text-on_surface dark:text-[#e8eaf0] leading-snug flex-1">
          {property.address}
        </p>
        <StatusBadge status={property.status} />
      </div>

      {/* Row 2: ULPIN */}
      <p className="text-label-sm text-on_surface_variant dark:text-[#9ba3b8] font-mono mb-3 mt-0.5">
        ULPIN: {property.ulpin}
      </p>

      {/* Row 3: Meta */}
      <div className="flex items-center gap-3 mb-4 xl:mb-5">
        <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
          {property.area.toLocaleString("en-IN")} sq ft
        </span>
        <span className="text-outline_variant">·</span>
        <span className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">{property.type}</span>
      </div>

      {/* Row 4: Actions */}
      <div className="flex items-center justify-between mt-auto pt-0 gap-3">
        <Link href={`/properties/${property.id}`} className="flex-1">
          <Button variant="ghost" size="sm" className="w-full font-bold uppercase tracking-widest text-[10px]">
            View Details
          </Button>
        </Link>
        <Button variant="default" size="sm" className="flex-1 font-bold uppercase tracking-widest text-[10px] shadow-lg">
          Initiate Transfer
        </Button>
      </div>
    </div>
  );
}
