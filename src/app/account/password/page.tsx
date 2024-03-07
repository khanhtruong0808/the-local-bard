import { cookies } from "next/headers";
import { z } from "zod";

import { UpdatePasswordForm } from "@/components/forms/UpdatePasswordForm";
import { createClient } from "@/lib/supabase/server";
import { FormServerState } from "@/lib/types";

const updatePasswordSchema = z
  .object({
    newPassword: z.string().trim(),
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export default async function UpdatePasswordPage() {
  async function updatePassword(
    currentState: FormServerState,
    formData: FormData,
  ): Promise<FormServerState> {
    "use server";
    const parsed = updatePasswordSchema.safeParse({
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        error: parsed.error.errors.map((e) => e.message).join("\n"),
      };
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const update = await supabase.auth.updateUser({
      password: parsed.data.newPassword,
    });

    if (update.error) return { status: "error", error: update.error.message };
    return { status: "success" };
  }

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <UpdatePasswordForm action={updatePassword} />
    </div>
  );
}
