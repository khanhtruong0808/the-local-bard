import { z } from "zod";
import { ynToBool } from "@/lib/utils";

export const createStageSchema = z.object({
  name: z.string().trim().min(1, "Stage name is required."),
  type: z.string().trim(),
  notes: z.string().trim(),
  street_address: z.string().trim(),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim(),
  postal_code: z.coerce
    .number()
    .int()
    .min(1, "Postal code is required.")
    .max(99999),
  wheelchair_accessible: z
    .string()
    .trim()
    .transform((val) => ynToBool(val)),
  seating_capacity: z.coerce
    .number()
    .int("Seating capacity must be a whole number.")
    .min(0, "Seating capacity must be a positive number.")
    .max(200_000, "Seating capacity is too high.")
    .optional(),
});

export const updateStageSchema = createStageSchema.extend({
  id: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
  address_id: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
});
