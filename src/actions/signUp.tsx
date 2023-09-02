"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function signUp(form: FormData) {
  const headersList = headers();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const supabase = createServerActionClient({ cookies });

  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${headersList.get("host")}/auth/callback`,
    },
  });

  if (signUp.error) {
    if (signUp.error.message === "User already registered") {
      redirect("/sign-up?error=User already registered");
    }
    redirect("/sign-up?error=Could not create user");
  }

  revalidatePath("/");
  redirect("/");
}
