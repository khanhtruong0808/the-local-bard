"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function signOut() {
  const supabase = createClient();

  const signOut = await supabase.auth.signOut();
  if (signOut.error) {
    console.error(signOut.error);
    return { error: signOut.error.message };
  }

  redirect("/login");
}
