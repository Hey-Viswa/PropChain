"use client";
import { useIsOracle } from "@/hooks/useIsOracle";
import { useWallet } from "@/hooks/useWallet";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function OracleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOracle, isLoading } = useIsOracle();
  const { isOracleMode } = useOracleAccessStore();
  const { isConnected, isConnecting, connect, disconnect, address, chain, isCorrectNetwork } = useWallet();
  const hasAccess = isOracle || isOracleMode;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl bg-surface_container dark:bg-[#1c2333]" />
        <Skeleton className="h-64 w-full rounded-xl bg-surface_container dark:bg-[#1c2333]" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0]">
          Wallet not connected
        </p>
        <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
          Connect your wallet to access Oracle functions.
        </p>
        <Button onClick={connect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    );
  }

  if (!isLoading && !hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-headline-md font-semibold text-on_surface dark:text-[#e8eaf0]">
          Access Denied
        </p>
        <p className="text-body-md text-on_surface_variant dark:text-[#9ba3b8]">
          Access denied. Use Oracle Access button in the navbar to enter your access code.
        </p>
        <p className="text-label-sm font-mono text-on_surface_variant/60">
          Connected: {address}
        </p>
        <p className="text-label-sm font-mono text-on_surface_variant/60">
          Network: {chain?.id ?? "unknown"} {isCorrectNetwork ? "" : "(wrong network)"}
        </p>
        <p className="text-label-sm font-mono text-on_surface_variant/60">
          Required role: ORACLE_ROLE on PropertyNFT contract
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
          <Button onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Reconnect Wallet"}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}