import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Web3Providers from "@/components/layout/Web3Providers";
import AppShellWrapper from "@/components/layout/AppShellWrapper";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-display",
  weight:   ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-body",
  weight:   ["400", "500", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${plusJakartaSans.variable}
                    ${inter.variable}`}>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
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
                <Suspense fallback={null}>
                  {children}
                </Suspense>
              </AppShellWrapper>
            </Web3Providers>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
