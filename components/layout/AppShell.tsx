"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Force reload user to get latest imageUrl
      user.reload();
    }
  }, [isLoaded, user]);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-10 2xl:px-16 2xl:py-12">
          <div className="w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
