"use server";

// This isn't working for some reason. The Google auth procedure goes through,
// but when we get back to the application, Supabase Auth says we're missing
// a sub claim. I'll figure it out later.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function signInWithGoogle() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const signIn = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (signIn.error) {
    console.error(signIn.error);
    return { error: signIn.error.message };
  }

  redirect(signIn.data.url);
}
