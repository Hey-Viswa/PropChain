import mongoose, { Schema, Document } from "mongoose";

export interface IKYCRecord extends Document {
  walletAddress: string;
  aadhaarLast4: string;
  kycVerified:  boolean;
  verifiedAt:   Date | null;
  createdAt:    Date;
}

const KYCSchema = new Schema<IKYCRecord>({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  aadhaarLast4:  { type: String, required: true },
  kycVerified:   { type: Boolean, default: false },
  verifiedAt:    { type: Date, default: null },
  createdAt:     { type: Date, default: Date.now },
});

export const KYCRecord = mongoose.models.KYCRecord ||
  mongoose.model<IKYCRecord>("KYCRecord", KYCSchema);