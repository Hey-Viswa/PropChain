"use client";

import { create } from "zustand";
export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    ulpin: 'MH0123456789',
    address: '12, Shivaji Nagar, Pune, Maharashtra 411005',
    area: 1200,
    type: 'Residential',
    status: 'verified',
    owner: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0E',
    registeredAt: '2025-01-14',
    ipfsCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    aiConfidence: 91,
    hasEncumbrance: false,
  },
  {
    id: '2',
    ulpin: 'MH9876543210',
    address: '4th Floor, Plot C-45, Bandra Kurla Complex, Mumbai 400051',
    area: 2800,
    type: 'Commercial',
    status: 'awaiting_oracle',
    owner: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0E',
    registeredAt: '2025-02-03',
    ipfsCid: 'QmYpVF3scuMDiXoKbHBLVmP1LJf3YquUjfg5xAJjzaMv6A',
    aiConfidence: 84,
    hasEncumbrance: false,
  },
  {
    id: '3',
    ulpin: 'KA1122334455',
    address: '78, 12th Main Road, Indiranagar, Bengaluru 560038',
    area: 900,
    type: 'Residential',
    status: 'needs_review',
    owner: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0E',
    registeredAt: '2025-02-18',
    ipfsCid: 'QmZqB7tLXs5yMUdvg7KvMtKFH6RGNK8yJUZf8HBcL7XVPN',
    aiConfidence: 61,
    hasEncumbrance: false,
  },
  {
    id: '4',
    ulpin: 'DL5544332211',
    address: 'Plot 9, Sector 12, Dwarka, New Delhi 110075',
    area: 1800,
    type: 'Residential',
    status: 'rejected',
    owner: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0E',
    registeredAt: '2025-01-28',
    ipfsCid: 'QmArGKjHLqcT4v3P7LMkXd8Rf9NwBqYt2CzUoSe5JVmWKL',
    aiConfidence: 42,
    hasEncumbrance: false,
  },
  {
    id: '5',
    ulpin: 'GJ6677889900',
    address: 'Survey No. 44, Satellite Road, Ahmedabad, Gujarat 380015',
    area: 3400,
    type: 'Agricultural',
    status: 'transferred',
    owner: '0x3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0E1F2G',
    registeredAt: '2024-12-10',
    ipfsCid: 'QmBsHLmKpRt5xNvQd6JwYc3Ug4PzCnXoAeTf7VkMsRqWbJ',
    aiConfidence: 88,
    hasEncumbrance: false,
  },
];
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
