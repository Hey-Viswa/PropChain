import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OracleAccessState {
  isOracleMode: boolean;
  attempts: number;
  lockedUntil: number | null;
  activatedAt: number | null;
  setOracleMode: (val: boolean) => void;
  incrementAttempts: () => void;
  setLocked: (until: number) => void;
  reset: () => void;
}

export const useOracleAccessStore = create<OracleAccessState>()(
  persist(
    (set) => ({
      isOracleMode: false,
      attempts: 0,
      lockedUntil: null,
      activatedAt: null,

      setOracleMode: (val) =>
        set({
          isOracleMode: val,
          activatedAt: val ? Date.now() : null,
          attempts: 0,
          lockedUntil: null,
        }),

      incrementAttempts: () =>
        set((s) => ({ attempts: s.attempts + 1 })),

      setLocked: (until) =>
        set({ lockedUntil: until }),

      reset: () =>
        set({
          isOracleMode: false,
          attempts: 0,
          lockedUntil: null,
          activatedAt: null,
        }),
    }),
    {
      name: "propchain-oracle-access",
      // Only persist isOracleMode and activatedAt
      // Do not persist attempts or lockedUntil
      partialize: (s) => ({
        isOracleMode: s.isOracleMode,
        activatedAt: s.activatedAt,
      }),
    }
  )
);
