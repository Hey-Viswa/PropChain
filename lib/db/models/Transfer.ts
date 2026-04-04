import mongoose, { Document, Schema } from "mongoose";

export const TRANSFER_STATUSES = [
  "PENDING_SELLER_SIGN",
  "PENDING_BUYER_ACCEPT",
  "COMPLETED",
  "CANCELLED",
] as const;

export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export interface ITransfer extends Document {
  propertyId: mongoose.Types.ObjectId;
  sellerClerkId: string;
  buyerClerkId: string;
  status: TransferStatus;
  sellerTxHash?: string;
  buyerTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema<ITransfer>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    sellerClerkId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    buyerClerkId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    status: {
      type: String,
      enum: TRANSFER_STATUSES,
      default: "PENDING_SELLER_SIGN",
      required: true,
      index: true,
    },
    sellerTxHash: {
      type: String,
      default: null,
    },
    buyerTxHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

TransferSchema.index({ propertyId: 1 });
TransferSchema.index({ sellerClerkId: 1 });
TransferSchema.index({ buyerClerkId: 1 });
TransferSchema.index({ status: 1 });

export const TransferModel =
  (mongoose.models.Transfer as mongoose.Model<ITransfer> | undefined) ||
  mongoose.model<ITransfer>("Transfer", TransferSchema);
