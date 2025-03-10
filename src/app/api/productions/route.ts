import { NextResponse } from "next/server";

import { createProductionServerSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/sendEmail";
import { serverEnv } from "@/lib/serverEnv";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createProductionServerSchema.safeParse(body);
  if (!parsed.success) {
    console.error(parsed.error);
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join("\n") },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.from("productions").insert({
    ...parsed.data,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendEmail({
      from: serverEnv.NOREPLY_EMAIL,
      to: serverEnv.ADMIN_EMAIL,
      subject: "New production created",
      text: `A new production was created: ${JSON.stringify(parsed.data, null, 2)}`,
    });
  } catch (error) {
    console.error("Error sending email", error);
  }

  revalidatePath("/account/productions");

  return Response.json({ body });
}
