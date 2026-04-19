import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Web3Providers from "@/components/layout/Web3Providers";
import AppShellWrapper from "@/components/layout/AppShellWrapper";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-dm-serif",
  weight:   ["400"],
  style:    ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  display:  "swap",
  preload:  true,
  variable: "--font-dm-sans",
  weight:   ["300", "400", "500", "600", "700"],
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
        className={`${dmSerifDisplay.variable} ${dmSans.variable}`}
      >
        <body className={dmSans.className}>
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
