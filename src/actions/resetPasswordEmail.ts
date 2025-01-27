"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function resetPasswordEmail(form: FormData) {
  const headersList = await headers();
  const email = form.get("email") as string;

  const supabase = createClient();

  const reset = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${headersList.get(
      "host",
    )}/auth/callback?next=/update-password`,
  });

  if (reset.error) {
    console.error(reset.error);
    return { error: reset.error.message };
  }

  redirect("/reset-password/check-email");
}
