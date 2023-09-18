"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function resetPassword(form: FormData) {
  const email = form.get("email") as string;

  const supabase = createServerActionClient({ cookies });

  const reset = await supabase.auth.resetPasswordForEmail(email);

  if (reset.error) {
    console.error(reset.error);
    return { error: reset.error.message };
  }

  console.log(reset);

  redirect("/reset-password/check-email");
}
