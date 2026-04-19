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
        "bg-white dark:bg-[#1a1916] rounded-xl p-5",
        "border border-stone dark:border-[#2a2520]",
        "hover:-translate-y-0.5 hover:border-pebble dark:hover:border-[#3a342e] hover:shadow-[0_8px_24px_rgba(26,25,24,0.07)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
        "transition-all duration-200 ease-out cursor-pointer flex flex-col gap-0"
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
      <div className="flex items-center justify-between mt-auto pt-0">
        <Link href={`/properties/${property.id}`}>
          <Button variant="ghost" size="sm">View Details</Button>
        </Link>
        <Button variant="secondary" size="sm">
          Initiate Transfer
        </Button>
      </div>
    </div>
  );
}
