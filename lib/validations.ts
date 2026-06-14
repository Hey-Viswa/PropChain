import { z } from "zod";

export const propertyDetailsSchema = z.object({
  ulpin: z
    .string()
    .min(1, "ULPIN is required")
    .regex(
      /^[A-Z]{2}\d{10}$/,
      "ULPIN must be 2 uppercase letters followed by 10 digits (e.g. MH1234567890)"
    ),
  address: z
    .string()
    .min(10, "Please enter a complete address")
    .max(200, "Address is too long"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  area: z.coerce
    .number({ invalid_type_error: "Area must be a number" })
    .positive("Area must be greater than 0"),
  type: z.enum(["Residential", "Commercial", "Agricultural"], {
    required_error: "Property type is required",
  }),
  description: z.string().max(500, "Description too long").optional(),
});

export type PropertyDetailsFormValues = z.infer<typeof propertyDetailsSchema>;

// ── Phase 2/3 API payload schemas ────────────────────────────────────────────

const walletRegex = /^0x[a-fA-F0-9]{40}$/;
const txHashRegex = /^0x[a-fA-F0-9]{64}$/;

export const encumbranceSchema = z.object({
  action: z.enum(["add", "release"]),
  tokenId: z.coerce.number().int().min(0),
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/),
  lender: z.string().regex(walletRegex, "Invalid lender wallet").optional(),
  amount: z.coerce.number().positive().optional(),
  reason: z.string().max(200).optional(),
  txHash: z.string().regex(txHashRegex, "Invalid tx hash").optional(),
});
export type EncumbrancePayload = z.infer<typeof encumbranceSchema>;

export const disputeSchema = z.object({
  action: z.enum(["raise", "resolve"]),
  tokenId: z.coerce.number().int().min(0),
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/),
  reason: z.string().min(3).max(500).optional(),
  resolution: z.string().min(3).max(500).optional(),
  txHash: z.string().regex(txHashRegex, "Invalid tx hash").optional(),
});
export type DisputePayload = z.infer<typeof disputeSchema>;

export const aiVerifySchema = z.object({
  text: z.string().max(20000).optional(),
  documentUrl: z.string().url().optional(),
  formUlpin: z.string().optional(),
  formArea: z.coerce.number().positive().optional(),
  kycName: z.string().optional(),
});
export type AiVerifyPayload = z.infer<typeof aiVerifySchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  owner: z.string().regex(walletRegex).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
export type SearchQuery = z.infer<typeof searchQuerySchema>;
