"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signInWithEmail(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const supabase = createServerActionClient({ cookies });

  const signIn = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signIn.error) {
    console.error(signIn.error);
    return { error: signIn.error.message };
  }

  revalidatePath("/");
  redirect("/");
}
