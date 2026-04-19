interface PropChainMarkProps {
  size?: number;
  className?: string;
}

export function PropChainMark({ size = 28, className = "" }: PropChainMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Terracotta square base */}
      <rect width="28" height="28" rx="5" fill="#D97757" />

      {/* P letterform — architectural, clean strokes */}
      <path
        d="M7 6v16M7 6h8a4 4 0 010 8H7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Chain nodes — two circles connected by a line, bottom-right */}
      <circle cx="17" cy="19" r="2" fill="white" opacity="0.72" />
      <line x1="19" y1="19" x2="21" y2="19" stroke="white" strokeWidth="1.5" opacity="0.72" />
      <circle cx="23" cy="19" r="2" fill="white" opacity="0.72" />
    </svg>
  );
}
