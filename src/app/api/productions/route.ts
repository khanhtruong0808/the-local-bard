import { NextResponse } from "next/server";

import { createProductionServerSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const runtime = "edge";

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

  const supabase = createClient();

  const { error } = await supabase.from("productions").insert({
    ...parsed.data,
  });

  revalidatePath("/account/productions");

  return Response.json({ body });
}
