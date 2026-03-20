import type { Property, AuditEntry, WalletUser } from "@/types";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    ulpin: "MH0123456789",
    address: "12, Shivaji Nagar, Pune, Maharashtra",
    area: 1200,
    type: "Residential",
    status: "verified",
    owner: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E",
    registeredAt: "2025-01-14",
    ipfsCid: "QmXo...a1b2",
    aiConfidence: 91,
    hasEncumbrance: false,
  },
  {
    id: "2",
    ulpin: "MH9876543210",
    address: "4th Floor, Bandra Kurla Complex, Mumbai, Maharashtra",
    area: 2800,
    type: "Commercial",
    status: "awaiting_oracle",
    owner: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E",
    registeredAt: "2025-02-03",
    ipfsCid: "QmYp...c3d4",
    aiConfidence: 84,
    hasEncumbrance: false,
  },
  {
    id: "3",
    ulpin: "KA1122334455",
    address: "78, Indiranagar, Bengaluru, Karnataka",
    area: 900,
    type: "Residential",
    status: "needs_review",
    owner: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E",
    registeredAt: "2025-02-18",
    ipfsCid: "QmZq...e5f6",
    aiConfidence: 61,
    hasEncumbrance: false,
  },
  {
    id: "4",
    ulpin: "DL5544332211",
    address: "Plot 9, Dwarka Sector 12, New Delhi",
    area: 1800,
    type: "Residential",
    status: "rejected",
    owner: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E",
    registeredAt: "2025-01-28",
    ipfsCid: "QmAr...g7h8",
    aiConfidence: 42,
    hasEncumbrance: false,
  },
  {
    id: "5",
    ulpin: "GJ6677889900",
    address: "Survey 44, Satellite, Ahmedabad, Gujarat",
    area: 3400,
    type: "Agricultural",
    status: "transferred",
    owner: "0x3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E1A2B",
    registeredAt: "2024-12-10",
    ipfsCid: "QmBs...i9j0",
    aiConfidence: 88,
    hasEncumbrance: false,
  },
];

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    action: "REGISTER",
    actor: "0x1A2B...9F0E",
    timestamp: "2025-02-18 10:32",
    note: "Property KA1122334455 submitted for registration.",
  },
  {
    id: "a2",
    action: "AI_FLAG",
    actor: "AI System",
    timestamp: "2025-02-18 10:33",
    note: "Confidence score 61% — flagged for manual oracle review.",
  },
  {
    id: "a3",
    action: "REGISTER",
    actor: "0x1A2B...9F0E",
    timestamp: "2025-02-03 14:10",
    note: "Property MH9876543210 submitted for registration.",
  },
  {
    id: "a4",
    action: "APPROVE",
    actor: "Oracle 0xOracle...A7F",
    timestamp: "2025-01-15 09:00",
    note: "Property MH0123456789 approved and minted to chain.",
  },
  {
    id: "a5",
    action: "REGISTER",
    actor: "0x1A2B...9F0E",
    timestamp: "2025-01-14 11:45",
    note: "Property MH0123456789 submitted for registration.",
  },
  {
    id: "a6",
    action: "TRANSFER",
    actor: "0x1A2B...9F0E",
    timestamp: "2024-12-12 16:22",
    note: "Property GJ6677889900 transferred to 0x3C4D...1E2F.",
  },
  {
    id: "a7",
    action: "LIEN_ADDED",
    actor: "Bank 0xBank1...B3C",
    timestamp: "2024-12-11 09:30",
    note: "Lien of ₹42,00,000 registered on GJ6677889900.",
  },
  {
    id: "a8",
    action: "LIEN_RELEASED",
    actor: "Bank 0xBank1...B3C",
    timestamp: "2024-12-12 15:50",
    note: "Lien released on GJ6677889900 after loan closure.",
  },
];

export const mockUser: WalletUser = {
  address: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9F0E",
  role: "USER",
  kycVerified: true,
  name: "Aryan Sharma",
};

// Backward compat aliases
export const mockProperties = MOCK_PROPERTIES;
export const mockAuditEntries = MOCK_AUDIT;

export const MOCK_SUBMISSIONS_OVER_TIME = [
  { date: 'Mar 14', approved: 4, rejected: 1 },
  { date: 'Mar 15', approved: 7, rejected: 2 },
  { date: 'Mar 16', approved: 5, rejected: 1 },
  { date: 'Mar 17', approved: 9, rejected: 3 },
  { date: 'Mar 18', approved: 6, rejected: 0 },
  { date: 'Mar 19', approved: 11, rejected: 2 },
  { date: 'Mar 20', approved: 8, rejected: 1 },
]

export const MOCK_VERIFICATION_OUTCOMES = [
  { name: 'Approved', value: 118, color: '#006e2c' },
  { name: 'Rejected', value: 24,  color: '#ba1a1a' },
]

export const MOCK_RECENT_ORACLE_ACTIVITY = [
  { action: 'APPROVE', ulpin: 'MH0123456789', decision: 'Approved', time: '10 min ago' },
  { action: 'REJECT',  ulpin: 'DL5544332211', decision: 'Rejected', time: '34 min ago' },
  { action: 'APPROVE', ulpin: 'KA1122334455', decision: 'Approved', time: '1 hr ago'  },
  { action: 'APPROVE', ulpin: 'GJ6677889900', decision: 'Approved', time: '2 hrs ago' },
  { action: 'REJECT',  ulpin: 'TN9988776655', decision: 'Rejected', time: '3 hrs ago' },
]
