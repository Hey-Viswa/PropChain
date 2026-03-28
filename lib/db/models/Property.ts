import mongoose, { Schema, Document } from "mongoose";

export const PROPERTY_STATUS = ["pending", "approved", "rejected"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUS)[number];

export const MINT_STATUS = ["idle", "submitted", "confirmed", "failed"] as const;
export type MintStatus = (typeof MINT_STATUS)[number];

export interface IPropertyRecord extends Document {
  walletAddress: string;
  tokenId: number | null;
  ulpin: string;
  physicalAddress: string;
  areaSqFt: number;
  propertyType: string;
  description: string;
  documentUrl: string;
  txHash: string | null;
  mintedAt: Date | null;
  mintStatus: MintStatus;
  mintError: string | null;
  status: PropertyStatus;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IPropertyRecord>({
  walletAddress:   { type: String, required: true, lowercase: true, trim: true },
  tokenId:         { type: Number, default: null, min: 0 },
  ulpin:           { type: String, required: true, unique: true, uppercase: true, trim: true },
  physicalAddress: { type: String, required: true },
  areaSqFt:        { type: Number, required: true },
  propertyType:    { type: String, required: true },
  description:     { type: String, default: "" },
  documentUrl:     { type: String, default: "" },
  txHash:          { type: String, default: null },
  mintedAt:        { type: Date, default: null },
  mintStatus:      { type: String, enum: MINT_STATUS, default: "idle" },
  mintError:       { type: String, default: null },
  status:          { type: String, enum: PROPERTY_STATUS, default: "pending" },
  approvedBy:      { type: String, default: null },
  approvedAt:      { type: Date, default: null },
  rejectedBy:      { type: String, default: null },
  rejectedAt:      { type: Date, default: null },
  rejectReason:    { type: String, default: null },
  createdAt:       { type: Date, default: Date.now },
}, { timestamps: true });

PropertySchema.index({ ulpin: 1 }, { unique: true });
PropertySchema.index({ walletAddress: 1, status: 1 });
PropertySchema.index({ walletAddress: 1, mintStatus: 1, createdAt: -1 });

export const PropertyRecord = mongoose.models.PropertyRecord ||
  mongoose.model<IPropertyRecord>("PropertyRecord", PropertySchema);
