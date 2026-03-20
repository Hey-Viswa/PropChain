import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId:       string;
  email:         string;
  walletAddress: string | null;
  role:          "USER" | "BANK" | "ORACLE" | "SUPER_ADMIN";
  createdAt:     Date;
}

const UserSchema = new Schema<IUser>({
  clerkId:       { type: String, required: true, unique: true },
  email:         { type: String, required: true },
  walletAddress: { type: String, default: null, lowercase: true },
  role:          {
    type: String,
    enum: ["USER", "BANK", "ORACLE", "SUPER_ADMIN"],
    default: "USER",
  },
  createdAt:     { type: Date, default: Date.now },
});

export const User = mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);