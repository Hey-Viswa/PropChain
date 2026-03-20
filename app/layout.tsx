import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import AppShellWrapper from "@/components/layout/AppShellWrapper";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Web3Providers from "@/components/layout/Web3Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PropChain | Property Registry",
  description: "Blockchain + AI Property Registry platform for India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
        <body className={inter.className}>
          <NextTopLoader
            color="#0050b2"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #0050b2,0 0 5px #0050b2"
          />
          <Web3Providers>
            <AppShellWrapper>
              <Suspense fallback={<div className="h-48 bg-surface_container rounded-xl animate-pulse" />}>{children}</Suspense>
            </AppShellWrapper>
            <Toaster />
          </Web3Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
