"use server";

import { ResponseError } from "@sendgrid/mail";

import { contactEmailSchema } from "@/lib/form-schemas/emails";
import { sendEmail } from "@/lib/sendEmail";
import { serverEnv } from "@/lib/serverEnv";
import type { FormServerState } from "@/lib/types";
import { redirect } from "next/navigation";

export async function sendContactEmail(
  currentState: FormServerState,
  formData: FormData,
): Promise<FormServerState> {
  const parsed = contactEmailSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.errors.map((e) => e.message).join("\n"),
    };
  }

  try {
    const body = `
You receieved a new message from the Contact Us form on The Local Bard.

Name: ${parsed.data.name}
Email: ${parsed.data.email}
Phone: ${parsed.data.phone || "No phone number provided"}
Message: ${parsed.data.message}`;

    await sendEmail({
      from: serverEnv.NOREPLY_EMAIL,
      to: serverEnv.ADMIN_EMAIL,
      subject: `Contact Form Submission from ${parsed.data.name}`,
      text: body,
    });
  } catch (error: ResponseError | any) {
    if (error instanceof ResponseError) {
      console.error(error.response.body);
      return { status: "error", error: error.response.body };
    }

    console.error(error);

    return {
      status: "error",
      error: "An unknown error occurred while sending your email.",
    };
  }

  return redirect("/contact/success");
}
