import mongoose, { Schema, Document } from "mongoose";

export const FRACTIONAL_STATUS = ["active", "redeemed"] as const;
export type FractionalStatus = (typeof FRACTIONAL_STATUS)[number];

export interface IFractionalization extends Document {
  tokenId: number;
  ulpin: string;
  owner: string; // wallet that fractionalized the property
  vaultAddress: string | null; // deployed FractionalOwnership vault (optional)
  shareName: string;
  shareSymbol: string;
  totalShares: number;
  status: FractionalStatus;
  txHashFractionalize: string | null;
  txHashRedeem: string | null;
  createdAt: Date;
  redeemedAt: Date | null;
  updatedAt: Date;
}

const FractionalizationSchema = new Schema<IFractionalization>(
  {
    tokenId: { type: Number, required: true, index: true },
    ulpin: { type: String, required: true, uppercase: true, trim: true, index: true },
    owner: { type: String, required: true, lowercase: true, trim: true },
    vaultAddress: { type: String, default: null, lowercase: true },
    shareName: { type: String, required: true },
    shareSymbol: { type: String, required: true, uppercase: true },
    totalShares: { type: Number, required: true, min: 1 },
    status: { type: String, enum: FRACTIONAL_STATUS, default: "active", index: true },
    txHashFractionalize: { type: String, default: null },
    txHashRedeem: { type: String, default: null },
    redeemedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

FractionalizationSchema.index({ tokenId: 1, status: 1 });

export const Fractionalization =
  mongoose.models.Fractionalization ||
  mongoose.model<IFractionalization>("Fractionalization", FractionalizationSchema);
