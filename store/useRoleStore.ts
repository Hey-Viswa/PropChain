import { create } from "zustand";
import { useAccount } from "wagmi";

interface RoleState {
  role: "USER" | "ORACLE";
  setRole: (role: "USER" | "ORACLE") => void;
}

const useStoreBase = create<RoleState>((set) => ({
  role: "USER",
  setRole: (role) => set({ role }),
}));

export function useRoleStore<T>(selector?: (state: RoleState) => T): any {
  const account = useAccount();
  const store = selector ? useStoreBase(selector) : useStoreBase();

  if (selector) {
    return store;
  }

  return {
    ...(store as RoleState),
    walletAddress: account.address,
    isConnected: account.isConnected,
  };
}

