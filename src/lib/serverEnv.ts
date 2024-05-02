import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().trim().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
  SENDGRID_API_KEY: z.string().trim().min(1).startsWith("SG."),
  ADMIN_EMAIL: z.string().email().trim().min(1),
  NOREPLY_EMAIL: z.string().email().trim().min(1),
});

export const serverEnv = envSchema.parse(process.env);
