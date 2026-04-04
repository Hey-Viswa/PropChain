import mongoose, { Schema, Document } from "mongoose";

export interface IKYC extends Document {
  clerkId:       string;
  walletAddress: string;
  aadhaarLast4:  string;
  verified:      boolean;
  verifiedAt:    Date | null;
  submittedAt:   Date;
  attempts:      number;
  ipAddress:     string;
}

const KYCSchema = new Schema<IKYC>(
  {
    clerkId: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    walletAddress: {
      type:  String,
      default: "",
      index: true,
    },
    aadhaarLast4: {
      type:     String,
      required: true,
    },
    verified: {
      type:    Boolean,
      default: false,
    },
    verifiedAt: {
      type:    Date,
      default: null,
    },
    submittedAt: {
      type:    Date,
      default: Date.now,
    },
    attempts: {
      type:    Number,
      default: 1,
    },
    ipAddress: {
      type:    String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "kyc_records",
  }
);

export const KYCRecord =
  (mongoose.models.KYCRecord as mongoose.Model<IKYC> | undefined) ||
  mongoose.model<IKYC>("KYCRecord", KYCSchema);

// Backward-compatible alias for existing imports.
export const KYC = KYCRecord;