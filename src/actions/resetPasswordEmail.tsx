"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function resetPasswordEmail(form: FormData) {
  const headersList = headers();
  const email = form.get("email") as string;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
