import mongoose, { Schema, Document } from "mongoose";

export const NOMINATION_STATUS = ["active", "executed", "revoked"] as const;
export type NominationStatus = (typeof NOMINATION_STATUS)[number];

export interface INominee {
  name: string;
  wallet: string;
  relation: string;
  sharePct: number;
}

export interface INomination extends Document {
  tokenId: number;
  ulpin: string;
  owner: string; // wallet of the owner who registered the nomination
  nominees: INominee[];
  status: NominationStatus;
  note: string;
  executedTo: string | null;
  executedBy: string | null;
  txHash: string | null;
  createdAt: Date;
  executedAt: Date | null;
  updatedAt: Date;
}

const NomineeSchema = new Schema<INominee>(
  {
    name: { type: String, required: true },
    wallet: { type: String, required: true, lowercase: true, trim: true },
    relation: { type: String, required: true },
    sharePct: { type: Number, required: true, min: 1, max: 100 },
  },
  { _id: false }
);

const NominationSchema = new Schema<INomination>(
  {
    tokenId: { type: Number, required: true, index: true },
    ulpin: { type: String, required: true, uppercase: true, trim: true, index: true },
    owner: { type: String, required: true, lowercase: true, trim: true },
    nominees: { type: [NomineeSchema], default: [] },
    status: { type: String, enum: NOMINATION_STATUS, default: "active", index: true },
    note: { type: String, default: "" },
    executedTo: { type: String, default: null, lowercase: true },
    executedBy: { type: String, default: null, lowercase: true },
    txHash: { type: String, default: null },
    executedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NominationSchema.index({ tokenId: 1, status: 1 });

export const Nomination =
  mongoose.models.Nomination ||
  mongoose.model<INomination>("Nomination", NominationSchema);
