import { z } from "zod";

import { urlRegex } from "@/lib/utils";

export const createProductionSchema = z.object({
  theater_id: z.number().int().positive(),
  name: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim(),
  stage_id: z.coerce.number().int().positive("Stage is required."),
  playwrights: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : []))
    .or(z.array(z.string())),
  directors: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : []))
    .or(z.array(z.string())),
  composers: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : []))
    .or(z.array(z.string())),
  genres: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "At least one genre is required.",
  }),
  kid_friendly: z.enum(["Yes", "No", ""]),
  cost_range: z.string().trim(),
  duration_minutes: z.coerce
    .number()
    .int()
    .min(0)
    .max(9999, "Duration is too long."),
  poster: z.custom<File>().optional(),
  poster_url: z.string().trim().url().optional().nullable(),
  url: z
    .string()
    .trim()
    .regex(urlRegex, "Invalid URL")
    .or(z.literal(""))
    .optional(),
  notes: z.string().trim(),
  // Custom field that we will convert to start_date and end_date on submit
  date_range: z
    .object({
      from: z.date(),
      to: z.date().optional(), // Optional because for one-day events
    })
    .optional(),
});

export const updateProductionSchema = createProductionSchema
  .extend({
    id: z.number().int().positive(),
  })
  .omit({ theater_id: true });

/**
 * Deal with data format on the server after it gets transformed by RHF on action.
 * Transform empty strings to nulls, and "Yes" and "No" to true and false.
 * This is for non-standard fields like booleans, numbers, and files.
 */
export const createProductionServerSchema = createProductionSchema
  .extend({
    kid_friendly: z.boolean().optional(),
    start_date: z.string(), // Supabase requires dates to be strings
    end_date: z.string(), // Supabase requires dates to be strings
  })
  .omit({ poster: true, date_range: true });

export const updateProductionServerSchema = createProductionServerSchema
  .extend({
    id: z.coerce.number().int().positive(),
  })
  .omit({ theater_id: true });

export type CreateProductionSchema = z.infer<typeof createProductionSchema>;
export type UpdateProductionSchema = z.infer<typeof updateProductionSchema>;
export type UpdateProductionServerSchema = z.infer<
  typeof updateProductionServerSchema
>;
export type CreateProductionServerSchema = z.infer<
  typeof createProductionServerSchema
>;
