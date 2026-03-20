"use client";

import { create } from "zustand";
import type { PropertyDetailsForm, AIResult } from "@/types";

interface MintState {
  step: 1 | 2 | 3 | 4;
  details: Partial<PropertyDetailsForm>;
  uploadedDocs: { name: string; size: number; type: string }[];
  aiResults: AIResult | null;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setDetails: (data: Partial<PropertyDetailsForm>) => void;
  addDoc: (doc: { name: string; size: number; type: string }) => void;
  removeDoc: (name: string) => void;
  setAIResults: (results: AIResult) => void;
  reset: () => void;
}

export const useMintStore = create<MintState>((set) => ({
  step: 1,
  details: {},
  uploadedDocs: [],
  aiResults: null,
  setStep: (step) => set({ step }),
  setDetails: (data) =>
    set((s) => ({ details: { ...s.details, ...data } })),
  addDoc: (doc) =>
    set((s) => ({ uploadedDocs: [...s.uploadedDocs, doc] })),
  removeDoc: (name) =>
    set((s) => ({
      uploadedDocs: s.uploadedDocs.filter((d) => d.name !== name),
    })),
  setAIResults: (aiResults) => set({ aiResults }),
  reset: () =>
    set({ step: 1, details: {}, uploadedDocs: [], aiResults: null }),
}));
