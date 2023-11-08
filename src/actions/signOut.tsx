"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const signOut = await supabase.auth.signOut();
  if (signOut.error) {
    console.error(signOut.error);
    return { error: signOut.error.message };
  }

  redirect("/login");
}
