"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import { useState } from "react";

export default function Web3Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Do not refetch on window focus in dev
            refetchOnWindowFocus: false,
            // Keep data warm for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused query data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Avoid extra mount/reconnect refetches
            refetchOnMount: false,
            refetchOnReconnect: false,
            // Retry once on failure
            retry: 1,
            // Slight backoff for transient failures
            retryDelay: 1500,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
