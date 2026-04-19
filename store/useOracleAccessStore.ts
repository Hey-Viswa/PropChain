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
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
      partialize: (s) => ({
        ...s,
        isOracleMode: s.isOracleMode,
        activatedAt: s.activatedAt,
        attempts: 0,
        lockedUntil: null,
      }),
    }
  )
);
