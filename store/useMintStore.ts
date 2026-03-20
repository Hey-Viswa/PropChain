"use client";

import { create } from "zustand";

type DocType = "sale_deed" | "gov_id" | "survey";

interface MintDoc {
  name: string;
  size: number;
  docType: DocType;
}

interface AIDocResult {
  name: string;
  score: number;
  fields: Record<string, string>;
}

interface AIResults {
  overallScore: number;
  documents: AIDocResult[];
}

interface Details {
  ulpin: string;
  address: string;
  state: string;
  district: string;
  area: number | null;
  type: "Residential" | "Commercial" | "Agricultural" | "";
  description: string;
}

interface MintState {
  step: 1 | 2 | 3 | 4;
  details: Details;
  uploadedDocs: MintDoc[];
  aiResults: AIResults | null;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setDetails: (data: Partial<Details>) => void;
  addDoc: (doc: MintDoc) => void;
  removeDoc: (name: string) => void;
  setAIResults: (results: AIResults) => void;
  reset: () => void;
}

const initialDetails: Details = {
  ulpin: "",
  address: "",
  state: "",
  district: "",
  area: null,
  type: "",
  description: "",
};

export const useMintStore = create<MintState>((set) => ({
  step: 1,
  details: { ...initialDetails },
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
    set({ step: 1, details: { ...initialDetails }, uploadedDocs: [], aiResults: null }),
}));
