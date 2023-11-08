import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "../clientEnv";

export const createClient = () =>
  createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
