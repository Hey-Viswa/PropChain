export default function PortfolioChart() {
  const data = [
    { label: "JAN", vol: 35 },
    { label: "FEB", vol: 50 },
    { label: "MAR", vol: 40 },
    { label: "APR", vol: 65 },
    { label: "MAY", vol: 55 },
    { label: "JUN", vol: 80 },
    { label: "JUL", vol: 90 },
  ];

  const max = 100;

  return (
    <div className="w-full h-48 flex items-end justify-between gap-2 xl:gap-4 mt-8 px-2">
      {data.map((col, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
          <div 
            className="w-full bg-[#b8cdef] hover:bg-primary transition-colors rounded-t-sm"
            style={{ height: `${(col.vol / max) * 100}%` }}
          />
          <div className="absolute -bottom-6 text-[10px] font-semibold text-on_surface_variant">
            {col.label}
          </div>
        </div>
      ))}
    </div>
  );
}
