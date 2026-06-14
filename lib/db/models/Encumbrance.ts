import mongoose, { Schema, Document } from "mongoose";

export const ENCUMBRANCE_STATUS = ["active", "released"] as const;
export type EncumbranceStatus = (typeof ENCUMBRANCE_STATUS)[number];

export interface IEncumbrance extends Document {
  tokenId: number;
  ulpin: string;
  lender: string; // wallet of the bank/lender
  amount: number;
  reason: string;
  status: EncumbranceStatus;
  txHashAdd: string | null;
  txHashRelease: string | null;
  createdAt: Date;
  releasedAt: Date | null;
  updatedAt: Date;
}

const EncumbranceSchema = new Schema<IEncumbrance>(
  {
    tokenId: { type: Number, required: true, index: true },
    ulpin: { type: String, required: true, uppercase: true, trim: true, index: true },
    lender: { type: String, required: true, lowercase: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, default: "" },
    status: { type: String, enum: ENCUMBRANCE_STATUS, default: "active", index: true },
    txHashAdd: { type: String, default: null },
    txHashRelease: { type: String, default: null },
    releasedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

EncumbranceSchema.index({ tokenId: 1, status: 1 });

export const Encumbrance =
  mongoose.models.Encumbrance ||
  mongoose.model<IEncumbrance>("Encumbrance", EncumbranceSchema);
