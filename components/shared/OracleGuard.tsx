"use client";
import { useIsOracle } from "@/hooks/useIsOracle";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OracleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOracle, isLoading } = useIsOracle();
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isOracle) {
      router.replace("/dashboard");
    }
  }, [isLoading, isOracle]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl bg-surface_container" />
        <Skeleton className="h-64 w-full rounded-xl bg-surface_container" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md font-semibold text-on_surface">
          Wallet not connected
        </p>
        <p className="text-body-md text-on_surface_variant">
          Connect your wallet to access Oracle functions.
        </p>
      </div>
    );
  }

  if (!isOracle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md font-semibold text-on_surface">
          Access Denied
        </p>
        <p className="text-body-md text-on_surface_variant">
          Your wallet does not have Oracle privileges.
        </p>
        <p className="text-label-sm font-mono text-on_surface_variant/60">
          Required role: ORACLE_ROLE on PropertyNFT contract
        </p>
      </div>
    );
  }

  return <>{children}</>;
}