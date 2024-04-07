"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const resetPasswordSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export default async function resetPassword(form: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const supabase = createClient();

  const update = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (update.error) {
    console.error(update.error);
    return { error: update.error.message };
  }

  redirect("/login");
}
