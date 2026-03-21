"use client";
import { useEffect, useState } from "react";

interface Axis {
  label:       string;
  value:       number;
  accentColor: string;
  dotColor:    string;
  dx:          number;
  dy:          number;
}

const AXES: Axis[] = [
  {
    label:       "Residential",
    value:       62,
    accentColor: "#0050b2",
    dotColor:    "#0050b2",
    dx: 0,
    dy: -1,
  },
  {
    label:       "Commercial",
    value:       24,
    accentColor: "#835500",
    dotColor:    "#835500",
    dx: 1,
    dy: 0,
  },
  {
    label:       "Industrial",
    value:       14,
    accentColor: "#006e2c",
    dotColor:    "#006e2c",
    dx: 0,
    dy: 1,
  },
  {
    label:       "Verified",
    value:       83,
    accentColor: "#0050b2",
    dotColor:    "#d6e3ff",
    dx: -1,
    dy: 0,
  },
];

const SIZE   = 220;
const CENTER = SIZE / 2;
const MAX_R  = 78;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

export default function AssetSpiderChart() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 900;
    const delay    = 400;

    const timer = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Compute point positions based on animation progress
  const points = AXES.map((axis) => {
    const r = (axis.value / 100) * MAX_R * progress;
    return {
      ...axis,
      x: CENTER + axis.dx * r,
      y: CENTER + axis.dy * r,
      r,
    };
  });

  // Build polygon path
  const polygonPoints = points
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  // Full axis endpoints (always full length)
  const axisEnds = AXES.map((axis) => ({
    x: CENTER + axis.dx * MAX_R,
    y: CENTER + axis.dy * MAX_R,
  }));

  return (
    <div className="flex flex-col items-center w-full">

      {/* Spider Chart SVG */}
      <div className="relative" style={{ width: SIZE,
                                         height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="overflow-visible">

          <defs>
            {/* Polygon glow */}
            <filter id="propchain-glow"
                    x="-50%" y="-50%"
                    width="200%" height="200%">
              <feGaussianBlur stdDeviation="3"
                              result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Dot glow */}
            <filter id="dot-glow"
                    x="-100%" y="-100%"
                    width="300%" height="300%">
              <feGaussianBlur stdDeviation="2"
                              result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Polygon gradient fill */}
            <radialGradient id="spider-fill"
                            cx="50%" cy="50%"
                            r="50%">
              <stop offset="0%"
                    stopColor="#0050b2"
                    stopOpacity="0.18" />
              <stop offset="100%"
                    stopColor="#0050b2"
                    stopOpacity="0.04" />
            </radialGradient>
          </defs>

          {/* Grid circles */}
          {GRID_LEVELS.map((level) => (
            <circle
              key={level}
              cx={CENTER}
              cy={CENTER}
              r={MAX_R * level}
              fill="none"
              stroke="#c3c6cf"
              strokeWidth={0.75}
              strokeDasharray={
                level === 1 ? "none" : "3 3"
              }
              opacity={0.35}
              className="dark:stroke-[#2a3347]"
            />
          ))}

          {/* Grid cross lines (axis lines full length) */}
          {axisEnds.map((end, i) => (
            <line
              key={`axis-${i}`}
              x1={CENTER} y1={CENTER}
              x2={end.x}  y2={end.y}
              stroke="#c3c6cf"
              strokeWidth={0.75}
              opacity={0.4}
              className="dark:stroke-[#2a3347]"
            />
          ))}

          {/* Filled polygon */}
          {progress > 0 && (
            <polygon
              points={polygonPoints}
              fill="url(#spider-fill)"
              stroke="#0050b2"
              strokeWidth={2}
              strokeLinejoin="round"
              filter="url(#propchain-glow)"
              opacity={progress}
            />
          )}

          {/* Colored segments from center to each point */}
          {points.map((p, i) => (
            <line
              key={`seg-${i}`}
              x1={CENTER} y1={CENTER}
              x2={p.x}    y2={p.y}
              stroke={p.accentColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#propchain-glow)"
              opacity={progress}
            />
          ))}

          {/* Data point dots */}
          {points.map((p, i) => (
            <g key={`dot-${i}`}
               opacity={Math.min(progress * 2, 1)}>
              {/* Outer glow ring */}
              <circle
                cx={p.x} cy={p.y}
                r={9}
                fill={p.accentColor}
                opacity={0.15}
                filter="url(#dot-glow)"
              />
              {/* Mid ring */}
              <circle
                cx={p.x} cy={p.y}
                r={5.5}
                fill={p.accentColor}
                opacity={0.25}
              />
              {/* Core dot */}
              <circle
                cx={p.x} cy={p.y}
                r={3.5}
                fill={p.dotColor}
                stroke="white"
                strokeWidth={1.5}
                filter="url(#dot-glow)"
              />
            </g>
          ))}

          {/* Center origin dot */}
          <circle
            cx={CENTER} cy={CENTER}
            r={2.5}
            fill="#c3c6cf"
            className="dark:fill-[#2a3347]"
          />

        </svg>

        {/* Axis labels — positioned outside SVG bounds */}

        {/* TOP — Residential */}
        <div className="absolute left-1/2 -translate-x-1/2"
             style={{ top: -28 }}>
          <div className="text-center">
            <p className="text-[11px] font-bold leading-none"
               style={{ color: "#0050b2" }}>
              62%
            </p>
            <p className="text-[9px] leading-tight
                           text-on_surface_variant
                           dark:text-[#9ba3b8]
                           whitespace-nowrap">
              Residential
            </p>
          </div>
        </div>

        {/* RIGHT — Commercial */}
        <div className="absolute top-1/2 -translate-y-1/2"
             style={{ right: -60 }}>
          <div className="text-left">
            <p className="text-[11px] font-bold leading-none"
               style={{ color: "#835500" }}>
              24%
            </p>
            <p className="text-[9px] leading-tight
                           text-on_surface_variant
                           dark:text-[#9ba3b8]
                           whitespace-nowrap">
              Commercial
            </p>
          </div>
        </div>

        {/* BOTTOM — Industrial */}
        <div className="absolute left-1/2 -translate-x-1/2"
             style={{ bottom: -30 }}>
          <div className="text-center">
            <p className="text-[11px] font-bold leading-none"
               style={{ color: "#006e2c" }}>
              14%
            </p>
            <p className="text-[9px] leading-tight
                           text-on_surface_variant
                           dark:text-[#9ba3b8]
                           whitespace-nowrap">
              Industrial
            </p>
          </div>
        </div>

        {/* LEFT — Verified */}
        <div className="absolute top-1/2 -translate-y-1/2"
             style={{ left: -58 }}>
          <div className="text-right">
            <p className="text-[11px] font-bold leading-none"
               style={{ color: "#0050b2" }}>
              83%
            </p>
            <p className="text-[9px] leading-tight
                           text-on_surface_variant
                           dark:text-[#9ba3b8]
                           whitespace-nowrap">
              Verified
            </p>
          </div>
        </div>

      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2
                      mt-10 w-full max-w-[200px]">
        {AXES.map((axis) => (
          <div key={axis.label}
               className="flex items-center
                          justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full
                           flex-shrink-0"
                style={{ backgroundColor: axis.accentColor }}
              />
              <span className="text-[11px]
                                text-on_surface_variant
                                dark:text-[#9ba3b8]">
                {axis.label}
              </span>
            </div>
            <span className="text-[11px] font-semibold
                              text-on_surface
                              dark:text-[#e8eaf0]
                              tabular-nums">
              {axis.value}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
