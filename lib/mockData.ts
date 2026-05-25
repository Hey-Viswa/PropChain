import type { Property, AuditEntry, WalletUser } from "@/types";

export const MOCK_PROPERTIES: Property[] = [];

export const MOCK_AUDIT: AuditEntry[] = [];

export const mockUser: WalletUser = {
  address: "",
  role: "USER",
  kycVerified: false,
  name: "",
};

// Backward compat aliases
export const mockProperties = MOCK_PROPERTIES;
export const mockAuditEntries = MOCK_AUDIT;

export const MOCK_SUBMISSIONS_OVER_TIME: Array<{ date: string; approved: number; rejected: number }> = [];

export const MOCK_VERIFICATION_OUTCOMES: Array<{ name: string; value: number; color: string }> = [];

export const MOCK_RECENT_ORACLE_ACTIVITY: Array<{ action: string; ulpin: string; decision: string; time: string }> = [];
