import mongoose, { Schema, Document } from "mongoose";

export type AdminRoleType = "ORACLE" | "BANK" | "SUPER_ADMIN";

export interface IAdminRole extends Document {
  clerkId: string;
  role: AdminRoleType;
  assignedAt: Date;
  assignedBy: string;
  note: string;
  active: boolean;
}

const AdminRoleSchema = new Schema<IAdminRole>({
  clerkId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ["ORACLE", "BANK", "SUPER_ADMIN"],
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  assignedBy: {
    type: String,
    default: "dev_admin",
  },
  note: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Compound unique index - one role per user
AdminRoleSchema.index(
  { clerkId: 1, role: 1 },
  { unique: true }
);

export const AdminRole =
  mongoose.models.AdminRole ||
  mongoose.model<IAdminRole>("AdminRole", AdminRoleSchema);
