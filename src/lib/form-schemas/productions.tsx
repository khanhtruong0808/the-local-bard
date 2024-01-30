import { z } from "zod";

export const createProductionSchema = z.object({
  theater_id: z.string().transform((val) => (val ? Number(val) : null)),
  name: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim(),
  stage_id: z
    .string()
    .trim()
    .transform((val) => (val && !isNaN(parseInt(val)) ? parseInt(val) : null)),
  writers: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : null)),
  directors: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : null)),
  composers: z
    .string()
    .trim()
    .transform((val) => (val ? val.split(",").map((v) => v.trim()) : null)),
  type: z.string().trim(),
  kid_friendly: z
    .string()
    .trim()
    .transform((val) => (val === "Yes" ? true : val === "No" ? false : null)),
  cost_range: z.string().trim(),
  duration_minutes: z.coerce.number().int().max(9999, "Duration is too long."),
  poster: z.custom<File>(), // z.instanceOf(File) gives a weird "File not defined error" even when there is a file
  poster_url: z.string().trim().url().optional().nullable(),
  url: z.string().trim(),
  notes: z.string().trim(),
  start_date: z.string().trim().min(1, "Opening Night is required."),
  end_date: z.string().trim().min(1, "Closing Night is required."),
});

export const updateProductionSchema = createProductionSchema
  .extend({
    id: z
      .string()
      .trim()
      .min(1)
      .transform((val) => parseInt(val)),
  })
  .omit({ theater_id: true });
