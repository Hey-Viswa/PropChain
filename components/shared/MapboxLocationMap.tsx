"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapboxLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  label?: string;
  className?: string;
  interactive?: boolean;
}

/**
 * Dependency-free location card.
 *
 * The original implementation used Mapbox GL tiles, which require a paid
 * Mapbox account beyond the free tier. To keep PropChain fully runnable on
 * free services, this renders a lightweight static location panel (coordinates
 * + a deep link to free OpenStreetMap) instead of streaming paid map tiles.
 */
export default function MapboxLocationMap({
  latitude,
  longitude,
  zoom = 13,
  label,
  className,
  interactive = true,
}: MapboxLocationMapProps) {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-stone/10 dark:bg-card",
        className
      )}
    >
      {/* Subtle grid backdrop to evoke a map without paid tiles */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "var(--tw-prose-borders, #94a3b8)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-on_primary shadow-lg dark:border-[#111]">
          <MapPin className="h-4 w-4" />
        </div>
        {label ? (
          <p className="text-sm font-semibold text-on_surface dark:text-[#e8eaf0]">{label}</p>
        ) : null}
        <p className="mt-1 font-mono text-[11px] text-on_surface_variant dark:text-[#9ba3b8]">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
        {interactive ? (
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-[11px] font-medium text-primary underline-offset-4 hover:underline"
          >
            Open in OpenStreetMap
          </a>
        ) : null}
      </div>
    </div>
  );
}
