/**
 * Validate that all public environment variables are defined properly.
 * These variables are exposed to the client, so they should all start with
 * NEXT_PUBLIC_...
 */
"use client";
import { z } from "zod";

// We have to manually define this here instead of doing envSchema.parse(process.env)
// because process.env acts weirdly in the browser and says that it's undefined.
const publicEnvVars = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GCP_PROJECT_ID: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const envSchema = z.object({
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().trim().min(1),
  NEXT_PUBLIC_GCP_PROJECT_ID: z.string().trim().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().trim().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
});

export const clientEnv = envSchema.parse(publicEnvVars);
