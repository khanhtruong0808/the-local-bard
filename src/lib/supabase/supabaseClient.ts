/* Reusable Supabase client for client components. */
"use client";
import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "../clientEnv";
import { Database } from "./database.types";

export const supabase = createClient<Database>(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
