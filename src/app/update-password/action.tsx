"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const updatePasswordAfterResetSchema = z
  .object({
    newPassword: z.string().trim(),
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default async function updatePasswordAfterReset(form: FormData) {
  const parsed = updatePasswordAfterResetSchema.safeParse({
    newPassword: form.get("newPassword"),
    confirmNewPassword: form.get("confirmNewPassword"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const supabase = await createClient();

  const update = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (update.error) {
    throw update.error;
  }

  redirect("/account/productions");
}
