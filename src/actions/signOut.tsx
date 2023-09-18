"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signOut() {
  const supabase = createServerActionClient({ cookies });

  const signOut = await supabase.auth.signOut();
  if (signOut.error) {
    console.error(signOut.error);
    return { error: signOut.error.message };
  }

  redirect("/login");
}
