"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FULL_HASHES: Record<string, string> = {
  "0x71C...3a4f": "0x71C4a91d8bc3c5e2f1a87e5c2b9d4e6f7a8b1c3a4f",
  "0x892...1b92": "0x892b3f4a7c9d1e2f5a6b7c8d9e0f1a2b3c4d5e1b92",
  "0x42f...a9c6": "0x42f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8a9c6",
};

const rows = [
  {
    hash: "0x71C...3a4f",
    type: "Luxury Villa #442",
    location: "Bengaluru, KA",
    value: "₹10.3 Cr",
    latency: "12.4s",
    status: "VERIFIED" as const,
  },
  {
    hash: "0x892...1b92",
    type: "Retail Hub — Zone A",
    location: "Mumbai, MH",
    value: "₹34.2 Cr",
    latency: "21.8s",
    status: "PROCESSING" as const,
  },
  {
    hash: "0x42f...a9c6",
    type: "Loft Penthouse 21B",
    location: "Hyderabad, TG",
    value: "₹7.4 Cr",
    latency: "8.2s",
    status: "VERIFIED" as const,
  },
];

type Status = "VERIFIED" | "PROCESSING";

const statusVariant: Record<Status, string> = {
  VERIFIED:   "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-warning/10 text-[#d97706] border-warning/20",
};

function HashCell({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const full = FULL_HASHES[hash] ?? hash;

  const copy = () => {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 group/hash">
      <span className="font-mono text-[11px] text-primary dark:text-[#E89874] font-medium">
        {hash}
      </span>
      <button
        onClick={copy}
        className={cn(
          "p-1 rounded transition-all",
          "opacity-0 group-hover/hash:opacity-100",
          copied
            ? "text-success"
            : "text-on_surface_variant/60 hover:text-on_surface dark:hover:text-[#e8e6e2]"
        )}
        title={copied ? "Copied!" : "Copy full hash"}
      >
        {copied
          ? <Check className="w-3 h-3" />
          : <Copy className="w-3 h-3" />
        }
      </button>
    </div>
  );
}

export default function NetworkTelemetry() {
  return (
    <Card className="border-stone dark:border-[#2a2520] bg-white dark:bg-[#1a1916] shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold font-display">
              Network Telemetry
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Live on-chain transaction stream
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-on_surface_variant dark:text-[#9b9690]">
              Live
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-stone dark:border-[#2a2520]">
                {["Transaction Hash", "Asset", "Value", "Latency", "Status"].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-on_surface_variant/60 dark:text-[#6b6560] whitespace-nowrap",
                      i === 4 && "text-right"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/50 dark:divide-[#2a2520]">
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-sand/60 dark:hover:bg-[#211f1c] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <HashCell hash={r.hash} />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-on_surface dark:text-[#e8e6e2] text-[13px] whitespace-nowrap">
                      {r.type}
                    </p>
                    <p className="text-[11px] text-on_surface_variant dark:text-[#9b9690] mt-0.5">
                      {r.location}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-on_surface dark:text-[#e8e6e2] text-[13px] whitespace-nowrap">
                    {r.value}
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-on_surface_variant dark:text-[#9b9690] tabular-nums whitespace-nowrap">
                    {r.latency}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold rounded-full px-2.5 py-0.5 border",
                        statusVariant[r.status]
                      )}
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-stone dark:border-[#2a2520]">
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-[#E89874] hover:bg-primary_fixed dark:hover:bg-[#3D1F10] h-8 gap-1.5 px-3"
          >
            <ExternalLink className="w-3 h-3" />
            View All Network Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
