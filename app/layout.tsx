import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Web3Providers from "@/components/layout/Web3Providers";
import AppShellWrapper from "@/components/layout/AppShellWrapper";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { Fraunces, Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const fraunces = Fraunces({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-fraunces",
  weight:   ["400", "500", "600", "700", "800", "900"],
  style:    ["normal", "italic"],
});

const manrope = Manrope({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-manrope",
  weight:   ["200", "300", "400", "500", "600", "700", "800"],
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
        className={`${fraunces.variable} ${manrope.variable}`}
      >
        <body className={manrope.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="#D97757"
              initialPosition={0.08}
              crawlSpeed={200}
              height={2}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 8px #D97757,0 0 4px #D97757"
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
