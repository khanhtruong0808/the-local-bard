import { z } from "zod";

export const createProductionSchema = z.object({
  theater_id: z.string().transform((val) => (val ? Number(val) : null)),
  name: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim(),
  stage_id: z
    .string()
    .trim()
    .transform((val) => (val ? Number(val) : null)),
  writers: z
    .string()
    .trim()
    .transform((val) => (val ? val.replace(/\s*,\s*/g, ",").split(",") : null)),
  directors: z
    .string()
    .trim()
    .transform((val) => (val ? val.replace(/\s*,\s*/g, ",").split(",") : null)),
  composers: z
    .string()
    .trim()
    .transform((val) => (val ? val.replace(/\s*,\s*/g, ",").split(",") : null)),
  type: z.string().trim(),
  kid_friendly: z
    .string()
    .trim()
    .transform((val) => (val ? val === "Yes" : null)),
  cost_range: z.string().trim(),
  duration_minutes: z
    .string()
    .trim()
    .transform((val) => (val ? Number(val) : null)),
  poster: z.instanceof(File),
  poster_url: z.string().trim().url().optional().nullable(),
  url: z.string().trim(),
  notes: z.string().trim(),
  start_date: z.string().trim(),
  end_date: z.string().trim(),
});

export const updateProductionSchema = createProductionSchema
  .extend({
    id: z.string().min(1),
  })
  .omit({ theater_id: true });
