export function useWallet() {
  // Dummy hook for Phase 1. Will be replaced by Wagmi in Task 2.
  return {
    address: null as string | null,
    isConnected: false,
    connect: () => {},
  };
}