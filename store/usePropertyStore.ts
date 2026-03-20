"use client";

import { create } from "zustand";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import type { Property, PropertyStatus } from "@/types";

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  filterStatus: PropertyStatus | "all";
  setFilter: (status: PropertyStatus | "all") => void;
  selectProperty: (id: string) => void;
  filteredProperties: () => Property[];
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: MOCK_PROPERTIES,
  selectedProperty: null,
  filterStatus: "all",
  setFilter: (filterStatus) => set({ filterStatus }),
  selectProperty: (id) =>
    set({
      selectedProperty:
        get().properties.find((p) => p.id === id) ?? null,
    }),
  filteredProperties: () => {
    const { properties, filterStatus } = get();
    return filterStatus === "all"
      ? properties
      : properties.filter((p) => p.status === filterStatus);
  },
}));
