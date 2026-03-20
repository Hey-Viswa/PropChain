export type PropertyStatus =
  | "pending_kyc"
  | "ai_parsing"
  | "needs_review"
  | "awaiting_oracle"
  | "verified"
  | "rejected"
  | "transferred";

export type AuditAction =
  | "REGISTER"
  | "APPROVE"
  | "TRANSFER"
  | "AI_FLAG"
  | "LIEN_ADDED"
  | "LIEN_RELEASED";

export type UserRole = "USER" | "BANK" | "ORACLE" | "SUPER_ADMIN";

export interface Property {
  id: string;
  ulpin: string;
  address: string;
  area: number;
  type: "Residential" | "Commercial" | "Agricultural";
  status: PropertyStatus;
  owner: string;
  registeredAt: string;
  ipfsCid: string;
  aiConfidence: number;
  hasEncumbrance: boolean;
}

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actor: string;
  timestamp: string;
  note: string;
}

export interface WalletUser {
  address: string;
  role: UserRole;
  kycVerified: boolean;
  name: string;
}

export interface AIResult {
  overallScore: number;
  documents: {
    name: string;
    score: number;
    fields: Record<string, string>;
    fraudFlags: string[];
  }[];
}

export interface PropertyDetailsForm {
  ulpin: string;
  address: string;
  state: string;
  district: string;
  area: number;
  type: "Residential" | "Commercial" | "Agricultural";
  description?: string;
}
