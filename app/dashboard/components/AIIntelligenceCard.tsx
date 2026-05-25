import Link from "next/link";
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Approved",       value: "0",  sub: "this month",      color: "text-success",                   dot: "bg-success"  },
  { label: "Rejected",       value: "0",  sub: "this month",      color: "text-error",                     dot: "bg-error"    },
  { label: "Avg turnaround", value: "0h", sub: "oracle response", color: "text-primary dark:text-[#E89874]",dot: "bg-primary"  },
];

export default function VerificationSummaryCard() {
  return (
    <div className="lg:col-span-1 bg-primary dark:bg-[#3D1F10] rounded-2xl p-6 flex flex-col h-full min-h-[320px]">

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center">
          <ClipboardList size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-white font-display leading-none">Verification Summary</h3>
          <p className="text-[10px] text-white/60 mt-0.5 uppercase tracking-wide">Oracle activity</p>
        </div>
      </div>

      <div className="space-y-2.5 flex-1">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} opacity-80`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/60 leading-none">{s.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
            </div>
            <span className="text-lg font-bold text-white tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1">
          <CheckCircle className="w-3.5 h-3.5 text-success/80" />
          <p className="text-[11px] text-white/60">
            <span className="text-white font-semibold">0 submissions</span> awaiting review
          </p>
        </div>
        <Link href="/oracle/queue">
          <Button
            size="sm"
            className="w-full bg-white/15 hover:bg-white/25 text-white border-0 text-xs font-semibold h-9"
          >
            Open Verification Queue
          </Button>
        </Link>
      </div>
    </div>
  );
}
