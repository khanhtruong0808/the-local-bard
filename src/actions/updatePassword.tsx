"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function resetPassword(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const supabase = createServerActionClient({ cookies });

  const update = await supabase.auth.updateUser({
    password,
  });

  if (update.error) {
    console.error(update.error);
    return { error: update.error.message };
  }

  redirect("/login");
}
