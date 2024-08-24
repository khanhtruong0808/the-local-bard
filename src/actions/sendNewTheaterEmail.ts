"use server";

import { ResponseError } from "@sendgrid/mail";
import { z } from "zod";

import { sendEmail } from "@/lib/sendEmail";
import { serverEnv } from "@/lib/serverEnv";
import type { FormServerState } from "@/lib/types";

export async function sendNewTheaterEmail(
  formData: FormData,
): Promise<FormServerState> {
  const schema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    theater_name: z.string(),
  });

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.errors.map((e) => e.message).join("\n"),
    };
  }

  try {
    const body = `
You have a new account/theater signup from ${parsed.data.first_name} ${parsed.data.last_name}.

Theater Name: ${parsed.data.theater_name}

Please go to the theaters table in Supabase to verify the new theater.
`;

    await sendEmail({
      from: serverEnv.NOREPLY_EMAIL,
      to: serverEnv.ADMIN_EMAIL,
      subject: `New Theater Created: ${parsed.data.theater_name}`,
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

  return {
    status: "success",
  };
}
