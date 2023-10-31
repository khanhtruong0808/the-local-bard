import { z } from "zod";

export const updateTheaterSchema = z.object({
  id: z.string().min(1),
  address_id: z.string().min(1),
  name: z.string().trim().min(1, "Theater name is required."),
  street_address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  postal_code: z
    .string()
    .trim()
    .transform((val) => (val ? Number(val) : null)),
  phone: z.string().trim(),
  email: z.string().trim().email(),
  notes: z.string().trim(),
  parking_instructions: z.string().trim(),
  url: z.string().trim().url(),
  type: z.string().trim(),
  concessions: z.string().trim(),
});
