"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function signUp(form: FormData) {
  const headersList = headers();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const supabase = createClient();

  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${headersList.get("host")}/auth/callback`,
    },
  });

  if (signUp.error) {
    return { error: signUp.error.message };
  }

  redirect("/sign-up/check-email");
}
