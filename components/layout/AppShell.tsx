"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Navbar from "./Navbar";
import NetworkWarning from "@/components/shared/NetworkWarning";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      user.reload();
    }
  }, [isLoaded, user]);

  return (
    <div className="flex h-screen bg-cream dark:bg-[#0f0e0d] overflow-hidden">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <NetworkWarning />
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-[calc(80px+env(safe-area-inset-bottom,0))] md:pb-8">
          <div className="w-full max-w-[1200px] mx-auto animate-fade-up">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — visible below md */}
      <MobileNav />
    </div>
  );
}
