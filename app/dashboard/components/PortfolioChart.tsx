"use client";
import { useState } from "react";

const data = [
  { label: "JAN", minted: 35, volume: 22 },
  { label: "FEB", minted: 50, volume: 38 },
  { label: "MAR", minted: 40, volume: 30 },
  { label: "APR", minted: 65, volume: 48 },
  { label: "MAY", minted: 55, volume: 42 },
  { label: "JUN", minted: 80, volume: 60 },
  { label: "JUL", minted: 90, volume: 72 },
];

const MAX = 100;

export default function PortfolioChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="w-full h-44 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-2.5 px-1">
        {data.map((col, i) => {
          const isHov = hovered === i;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full gap-0.5 group cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <div className="absolute mb-1 z-10 pointer-events-none bg-on_surface dark:bg-[#e8e6e2] text-cream dark:text-[#1a1916] rounded-xl px-2.5 py-1.5 text-[10px] font-semibold shadow-floating whitespace-nowrap -translate-y-[calc(100%+8px)]">
                  Minted {col.minted}% · Vol {col.volume}%
                </div>
              )}

              {/* Grouped bars */}
              <div className="relative w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                {/* Volume bar (secondary — behind) */}
                <div
                  className="flex-1 rounded-t-[3px] bg-secondary/30 dark:bg-[#5c3a00]/40 transition-all duration-300"
                  style={{ height: `${(col.volume / MAX) * 100}%` }}
                />
                {/* Minted bar (primary) */}
                <div
                  className="flex-1 rounded-t-[3px] transition-all duration-300"
                  style={{
                    height: `${(col.minted / MAX) * 100}%`,
                    backgroundColor: isHov
                      ? "#C4602A"
                      : "#D97757",
                  }}
                />
              </div>

              <span className="text-[9px] sm:text-[10px] font-semibold text-on_surface_variant/60 dark:text-[#6b6560] mt-2 select-none">
                {col.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
