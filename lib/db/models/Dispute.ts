import mongoose, { Schema, Document } from "mongoose";

export const DISPUTE_STATUS = ["open", "resolved"] as const;
export type DisputeStatus = (typeof DISPUTE_STATUS)[number];

export interface IDispute extends Document {
  tokenId: number;
  ulpin: string;
  raisedBy: string; // wallet that raised the dispute
  reason: string;
  status: DisputeStatus;
  resolution: string | null;
  resolvedBy: string | null;
  txHashRaise: string | null;
  txHashResolve: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    tokenId: { type: Number, required: true, index: true },
    ulpin: { type: String, required: true, uppercase: true, trim: true, index: true },
    raisedBy: { type: String, required: true, lowercase: true, trim: true },
    reason: { type: String, required: true },
    status: { type: String, enum: DISPUTE_STATUS, default: "open", index: true },
    resolution: { type: String, default: null },
    resolvedBy: { type: String, default: null },
    txHashRaise: { type: String, default: null },
    txHashResolve: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

DisputeSchema.index({ tokenId: 1, status: 1 });

export const Dispute =
  mongoose.models.Dispute || mongoose.model<IDispute>("Dispute", DisputeSchema);
