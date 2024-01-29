import { z } from "zod";

export const createStageSchema = z.object({
  name: z.string().trim().min(1, "Stage name is required."),
  type: z.string().trim(),
  notes: z.string().trim(),
  street_address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  postal_code: z
    .string()
    .trim()
    .transform((val) => (val ? Number(val) : null)),
  wheelchair_accessible: z
    .string()
    .trim()
    .transform((val) => (val ? val === "Yes" : null)),
  seating_capacity: z
    .string()
    .trim()
    .transform((val) => (val ? Number(val) : null)),
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
