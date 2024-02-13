import { z } from "zod";

export const createStageSchema = z.object({
  name: z.string().trim().min(1, "Stage name is required."),
  type: z.string().trim(),
  notes: z.string().trim(),
  street_address: z.string().trim().min(1, "Street address is required."),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  postal_code: z.string().trim().min(5).max(10),
  wheelchair_accessible: z.enum(["Yes", "No", ""]),
  seating_capacity: z
    .number()
    .int("Seating capacity must be a whole number.")
    .min(0, "Seating capacity must be a positive number.")
    .max(200_000, "Seating capacity is too high."),
});

export const updateStageSchema = createStageSchema.extend({
  id: z.number(),
  address_id: z.number().or(z.literal("")),
});

export type CreateStageSchema = z.infer<typeof createStageSchema>;
export type UpdateStageSchema = z.infer<typeof updateStageSchema>;
