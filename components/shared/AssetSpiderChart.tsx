"use client";
import { useEffect, useState } from "react";

const SEGMENTS = [
  { label: "Residential", value: 62, color: "#D97757" },
  { label: "Commercial",  value: 24, color: "#C4602A" },
  { label: "Industrial",  value: 14, color: "#F6EAE3" },
];

const VERIFICATION_RATE = 83;

const SIZE   = 120;
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const RADIUS = 44;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

export default function AssetSpiderChart() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 900;
    const timer = setTimeout(() => {
      const animate = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        setProgress(1 - Math.pow(1 - t, 3));
        if (t < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, 300);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, []);

  // Build donut arcs
  let currentAngle = 0;
  const arcs = SEGMENTS.map((seg) => {
    const sweep = seg.value * 3.6 * progress;
    const arc = {
      ...seg,
      path: describeArc(CX, CY, RADIUS, currentAngle, currentAngle + sweep - 0.5),
      startAngle: currentAngle,
    };
    currentAngle += seg.value * 3.6;
    return arc;
  });

  const verifiedOffset = CIRCUMFERENCE * (1 - (VERIFICATION_RATE / 100) * progress);

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Top row: donut + legend */}
      <div className="flex items-center gap-5">

        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* Track */}
            <circle
              cx={CX} cy={CY} r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-stone dark:text-[#2a2520]"
              opacity={0.4}
            />
            {/* Segments */}
            {arcs.map((arc) => (
              <path
                key={arc.label}
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[13px] font-bold text-on_surface dark:text-[#e8eaf0] font-display leading-none">
              {Math.round(SEGMENTS.reduce((s, x) => s + x.value, 0) * progress)}%
            </span>
            <span className="text-[8px] uppercase tracking-[0.06em] text-on_surface_variant dark:text-[#9ba3b8] mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {SEGMENTS.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[11px] text-on_surface_variant dark:text-[#9ba3b8] truncate">
                  {seg.label}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-on_surface dark:text-[#e8eaf0] tabular-nums flex-shrink-0">
                {Math.round(seg.value * progress)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verification ring */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary_fixed/40 dark:bg-[#3D1F10]/30">
        <svg width={36} height={36} viewBox="0 0 36 36" className="flex-shrink-0">
          <circle cx={18} cy={18} r={14} fill="none" stroke="currentColor"
            strokeWidth={3} className="text-stone dark:text-[#2a2520]" opacity={0.4} />
          <circle cx={18} cy={18} r={14} fill="none" stroke="#D97757"
            strokeWidth={3} strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE * (14 / RADIUS)}
            strokeDashoffset={(CIRCUMFERENCE * (14 / RADIUS)) * (1 - (VERIFICATION_RATE / 100) * progress)}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on_surface dark:text-[#e8eaf0]">
              Verified Assets
            </span>
            <span className="text-[11px] font-bold text-primary dark:text-[#E89874] tabular-nums">
              {Math.round(VERIFICATION_RATE * progress)}%
            </span>
          </div>
          <div className="h-1 bg-stone dark:bg-[#2a2520] rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-primary dark:bg-[#E89874] rounded-full transition-none"
              style={{ width: `${VERIFICATION_RATE * progress}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
