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

export const fractionalSchema = z.object({
  action: z.enum(["fractionalize", "redeem"]),
  tokenId: z.coerce.number().int().min(0),
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/),
  totalShares: z.coerce.number().int().min(1).max(10_000_000).optional(),
  shareName: z.string().min(2).max(60).optional(),
  shareSymbol: z
    .string()
    .min(2)
    .max(8)
    .regex(/^[A-Za-z0-9]+$/, "Symbol must be alphanumeric")
    .optional(),
  vaultAddress: z.string().regex(walletRegex, "Invalid vault address").optional(),
  txHash: z.string().regex(txHashRegex, "Invalid tx hash").optional(),
});
export type FractionalPayload = z.infer<typeof fractionalSchema>;

const nomineeSchema = z.object({
  name: z.string().min(2).max(80),
  wallet: z.string().regex(walletRegex, "Invalid nominee wallet"),
  relation: z.string().min(2).max(40),
  sharePct: z.coerce.number().min(1).max(100),
});

export const successionSchema = z.object({
  action: z.enum(["nominate", "execute", "revoke"]),
  tokenId: z.coerce.number().int().min(0),
  ulpin: z.string().regex(/^[A-Z]{2}\d{10}$/),
  nominees: z.array(nomineeSchema).min(1).max(6).optional(),
  executeTo: z.string().regex(walletRegex, "Invalid heir wallet").optional(),
  note: z.string().max(300).optional(),
  txHash: z.string().regex(txHashRegex, "Invalid tx hash").optional(),
});
export type SuccessionPayload = z.infer<typeof successionSchema>;
