import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyRecord extends Document {
  walletAddress:  string;
  tokenId:        number | null;
  ulpin:          string;
  physicalAddress:string;
  areaSqFt:       number;
  propertyType:   string;
  description:    string;
  documentUrl:    string;
  txHash:         string | null;
  status:         "pending" | "approved" | "rejected";
  approvedBy:     string | null;
  approvedAt:     Date | null;
  rejectedBy:     string | null;
  rejectedAt:     Date | null;
  rejectReason:   string | null;
  createdAt:      Date;
}

const PropertySchema = new Schema<IPropertyRecord>({
  walletAddress:   { type: String, required: true, lowercase: true },
  tokenId:         { type: Number, default: null },
  ulpin:           { type: String, required: true, unique: true },
  physicalAddress: { type: String, required: true },
  areaSqFt:        { type: Number, required: true },
  propertyType:    { type: String, required: true },
  description:     { type: String, default: "" },
  documentUrl:     { type: String, default: "" },
  txHash:          { type: String, default: null },
  status:          { type: String, enum: ["pending","approved","rejected"],
                     default: "pending" },
  approvedBy:      { type: String, default: null },
  approvedAt:      { type: Date, default: null },
  rejectedBy:      { type: String, default: null },
  rejectedAt:      { type: Date, default: null },
  rejectReason:    { type: String, default: null },
  createdAt:       { type: Date, default: Date.now },
});

export const PropertyRecord = mongoose.models.PropertyRecord ||
  mongoose.model<IPropertyRecord>("PropertyRecord", PropertySchema);