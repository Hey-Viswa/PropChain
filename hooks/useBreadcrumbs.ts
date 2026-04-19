"use client";

import { usePathname } from "next/navigation";
import { MOCK_PROPERTIES } from "@/lib/mockData";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeMap: Record<string, string> = {
  dashboard: "Dashboard",
  properties: "My Properties",
  mint: "Mint Asset",
  details: "Property Details",
  upload: "Upload Documents",
  "ai-check": "AI Verification",
  review: "Review & Sign",
  audit: "Audit History",
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];

  parts.forEach((part, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");

    // Check if it looks like a property ID (numeric or starts with "prop-")
    if (i > 0 && parts[i - 1] === "properties") {
      const prop = MOCK_PROPERTIES.find((p) => p.id === part);
      crumbs.push({
        label: prop ? prop.address.split(",")[0] : "Property Detail",
        href,
      });
      return;
    }

    const label = routeMap[part];
    if (label) {
      crumbs.push({ label, href });
    }
  });

  return crumbs;
}
