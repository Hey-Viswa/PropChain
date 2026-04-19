import mongoose, { Schema, Document } from "mongoose";

export type ActivityType =
  | "LOGIN"
  | "WALLET_CONNECT"
  | "KYC_SUBMIT"
  | "PROPERTY_REGISTER"
  | "BLOCKCHAIN_MINT"
  | "MINT_CONFIRMED"
  | "DOCUMENT_UPLOAD"
  | "AI_SCAN"
  | "TRANSFER_INIT"
  | "TRANSFER_COMPLETE"
  | "ORACLE_APPROVE"
  | "ORACLE_REJECT"
  | "ORACLE_ROLE_GRANTED"
  | "FRAUD_FLAG"
  | "LIEN_ADDED"
  | "LIEN_RELEASED"
  | "PROFILE_UPDATE"
  | "RECOVERY_MINT_CONFIRMED"
  | "EVENT_SYNC_MINTED"
  | "EVENT_SYNC_APPROVED"
  | "EVENT_SYNC_REJECTED"
  | "EVENT_SYNC_TRANSFER";

export interface IActivityLog extends Document {
  clerkId: string;
  walletAddress: string;
  type: ActivityType;
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  flagged: boolean;
  flagReason: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    clerkId: { type: String, required: true, index: true },
    walletAddress: { type: String, default: "" },
    type: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
    flagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ clerkId: 1, createdAt: -1 });
ActivityLogSchema.index({ flagged: 1 });
ActivityLogSchema.index({ type: 1 });

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
