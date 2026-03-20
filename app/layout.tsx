import type { Metadata } from "next";
// Import fonts from Google Fonts
import { Plus_Jakarta_Sans, Inter, Geist } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppShellWrapper from "@/components/layout/AppShellWrapper";

import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans", // Used in tailwind config for 'display'
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Used in tailwind config for 'body'
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
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body
          className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
        >
          <AppShellWrapper>
            {children}
          </AppShellWrapper>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
