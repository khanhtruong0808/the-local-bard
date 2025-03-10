"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { FormServerState } from "@/lib/types";

export default async function signOut(
  prevState: FormServerState,
  formData: FormData,
): Promise<FormServerState> {
  const supabase = await createClient();

  const signOut = await supabase.auth.signOut();
  if (signOut.error) {
    console.error(signOut.error);
    return { status: "error", error: signOut.error.message };
  }

  redirect("/login");
}
