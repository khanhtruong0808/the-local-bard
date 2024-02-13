import { z } from "zod";

export const updateTheaterSchema = z.object({
  id: z.number().int().positive(),
  address_id: z.number().or(z.literal("")),
  name: z.string().trim().min(1, "Theater name is required."),
  street_address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  postal_code: z.string().trim().min(5).max(10),
  notes: z.string().trim(),
  parking_instructions: z.string().trim(),
  url: z.string().trim().url(),
  type: z.string().trim(),
  concessions: z.string().trim(),
});

export type UpdateTheaterSchema = z.infer<typeof updateTheaterSchema>;
