import { z } from "zod";

import { ynToBool } from "@/lib/utils";

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
  duration_minutes: z.number().int().min(0).max(9999, "Duration is too long."),
  poster: z.custom<File>().optional(), // z.instanceOf(File) gives a weird "File not defined error" even when there is a file
  poster_url: z.string().trim().url().optional().nullable(),
  url: z.string().trim(),
  notes: z.string().trim(),
  start_date: z.string().trim().min(1, "Opening Night is required."),
  end_date: z.string().trim().min(1, "Closing Night is required."),
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
export const createProductionServerSchema = createProductionSchema.extend({
  kid_friendly: z.enum(["Yes", "No", ""]).transform((val) => ynToBool(val)),
  poster: z.instanceof(FormData).optional(), // transformed in form action
});

export const updateProductionServerSchema = createProductionServerSchema
  .extend({
    id: z.number().int().positive(),
  })
  .omit({ theater_id: true });

export type CreateProductionSchema = z.infer<typeof createProductionSchema>;
export type UpdateProductionSchema = z.infer<typeof updateProductionSchema>;
