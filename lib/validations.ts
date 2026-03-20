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
