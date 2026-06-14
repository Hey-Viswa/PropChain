"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

export default function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page and the printable ownership certificate render full-bleed,
  // without the dashboard sidebar/topbar chrome.
  if (pathname === "/" || pathname.startsWith("/certificate")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
