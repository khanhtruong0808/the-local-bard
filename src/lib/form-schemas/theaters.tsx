import { z } from "zod";

export const updateTheaterSchema = z.object({
  id: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
  address_id: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
  name: z.string().trim().min(1, "Theater name is required."),
  street_address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  postal_code: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
  notes: z.string().trim(),
  parking_instructions: z.string().trim(),
  url: z.string().trim().url(),
  type: z.string().trim(),
  concessions: z.string().trim(),
});

export type UpdateTheaterSchema = z.infer<typeof updateTheaterSchema>;
