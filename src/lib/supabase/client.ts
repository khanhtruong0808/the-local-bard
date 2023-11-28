import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "../clientEnv";
import { Database } from "./database.types";

export const createClient = () =>
  createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
