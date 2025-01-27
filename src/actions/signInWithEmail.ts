"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function signInWithEmail(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const supabase = await createClient();

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
