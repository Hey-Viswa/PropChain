"use client";

import { MapPin } from "lucide-react";
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl/mapbox";
import { cn } from "@/lib/utils";

interface MapboxLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  label?: string;
  className?: string;
  interactive?: boolean;
}

export default function MapboxLocationMap({
  latitude,
  longitude,
  zoom = 13,
  label,
  className,
  interactive = true,
}: MapboxLocationMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-xl bg-stone/10 dark:bg-card",
          className
        )}
      >
        <div className="text-center px-4">
          <p className="text-sm font-semibold text-on_surface dark:text-[#e8eaf0]">Map preview unavailable</p>
          <p className="text-xs text-on_surface_variant dark:text-[#9ba3b8] mt-1">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to enable Mapbox.
          </p>
          <p className="text-[11px] text-on_surface_variant/70 dark:text-[#9ba3b8]/70 mt-2 font-mono">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full rounded-xl overflow-hidden", className)}>
      <Map
        key={`${latitude.toFixed(5)}:${longitude.toFixed(5)}:${zoom}`}
        initialViewState={{ latitude, longitude, zoom }}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        reuseMaps
        dragRotate={false}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        touchZoomRotate={interactive}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <ScaleControl position="bottom-left" />

        <Marker latitude={latitude} longitude={longitude} anchor="bottom">
          <div className="h-8 w-8 rounded-full bg-primary text-on_primary border-2 border-white dark:border-[#111] shadow-lg flex items-center justify-center">
            <MapPin className="h-4 w-4" />
          </div>
        </Marker>
      </Map>

      {label ? (
        <div className="absolute left-3 top-3 rounded-xl bg-white/90 dark:bg-[#10141f]/90 px-2.5 py-1.5 text-[11px] font-medium text-on_surface dark:text-[#e8eaf0] shadow-sm backdrop-blur">
          {label}
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/45 dark:from-[dark:bg-card]/70 to-transparent pointer-events-none" />
    </div>
  );
}
