"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

import type { Database } from "@/lib/supabase/database.types";

const updatePasswordSchema = z
  .object({
    oldPassword: z.string().trim(),
    newPassword: z.string().trim(),
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default async function updatePassword(form: FormData) {
  const parsed = updatePasswordSchema.safeParse({
    oldPassword: form.get("oldPassword"),
    newPassword: form.get("newPassword"),
    confirmNewPassword: form.get("confirmNewPassword"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const supabase = createServerActionClient<Database>({ cookies });

  const update = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (update.error) {
    console.error(update.error);
    return { error: update.error.message };
  }
}
