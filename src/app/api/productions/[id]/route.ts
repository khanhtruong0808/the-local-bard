import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { updateProductionServerSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const intId = parseInt(params.id, 10);
  if (isNaN(intId)) {
    return NextResponse.json(
      { error: "Invalid ID parameter" },
      { status: 400 },
    );
  }

  const body = await request.json();
  const parsed = updateProductionServerSchema.safeParse(body);
  if (!parsed.success) {
    console.error(parsed.error);
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join("\n") },
      { status: 400 },
    );
  }

  if (parsed.data.id !== intId) {
    return NextResponse.json(
      { error: "ID in body does not match ID in URL" },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("productions")
    .update({
      ...parsed.data,
    })
    .eq("id", intId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath(`/account/productions/${intId}`);

  return NextResponse.json(null, { status: 200 });
}
