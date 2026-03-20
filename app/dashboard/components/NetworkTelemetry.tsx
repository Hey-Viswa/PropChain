import { Badge } from "@/components/ui/badge";

export default function NetworkTelemetry() {
  const rows = [
    { hash: "0x71C...3a4f", type: "Luxury Villa #442", value: "$1,240,000", latency: "12.4s", status: "VERIFIED", sColor: "text-success bg-success/10" },
    { hash: "0x892...1b92", type: "Retail Hub - Zone A", value: "$4,120,000", latency: "21.8s", status: "PROCESSING", sColor: "text-[#d97706] bg-warning/10" },
    { hash: "0x42f...a9c6", type: "Loft Penthouse 21B", value: "$890,000", latency: "8.2s", status: "VERIFIED", sColor: "text-success bg-success/10" },
  ];

  return (
    <div className="bg-surface_container_lowest rounded-2xl px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-outline_variant/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-on_surface">Network Telemetry</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant">Live Node Stream</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-outline_variant/20 text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">
              <th className="pb-3 px-2 font-medium">Transaction Hash</th>
              <th className="pb-3 px-2 font-medium">Asset Type</th>
              <th className="pb-3 px-2 font-medium">Value</th>
              <th className="pb-3 px-2 font-medium">Latency</th>
              <th className="pb-3 px-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline_variant/10">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-surface_container_low/50 transition-colors">
                <td className="py-4 px-2 font-mono text-primary font-medium text-xs">{r.hash}</td>
                <td className="py-4 px-2 font-medium text-on_surface">{r.type}</td>
                <td className="py-4 px-2 font-semibold text-on_surface">{r.value}</td>
                <td className="py-4 px-2 text-on_surface_variant text-xs">{r.latency}</td>
                <td className="py-4 px-2 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.sColor}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-outline_variant/20 text-center">
        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
          View All Network Activity
        </button>
      </div>
    </div>
  );
}
