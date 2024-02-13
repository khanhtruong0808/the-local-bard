"use server";

import { cookies } from "next/headers";

import {
  createProductionServerSchema,
  type CreateProductionSchema,
} from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";
import { FormServerState } from "@/lib/types";
import { revalidatePath } from "next/cache";

export default async function createProduction(
  currentState: FormServerState,
  form: CreateProductionSchema,
): Promise<FormServerState> {
  const parsed = createProductionServerSchema.safeParse(form);
  if (!parsed.success) {
    const error = parsed.error.errors.map((e) => e.message).join("\n");
    return { status: "error", error };
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { poster, ...newProduction } = parsed.data;

  const posterFile = poster ? poster.get("poster") : null;

  if (posterFile && posterFile instanceof File && posterFile.size > 0) {
    const { error: fileError } = await supabase.storage
      .from("posters")
      .upload(posterFile.name, posterFile, {
        upsert: true,
      });

    if (fileError) {
      throw fileError.message; // We actually want to see this error logged
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(posterFile.name);

    const { publicUrl } = data;
    newProduction.poster_url = publicUrl;
  }

  const { error } = await supabase.from("productions").insert({
    ...newProduction,
  });

  if (error) return { status: "error", error: error.message };

  revalidatePath("/account/productions");

  return { status: "success" };
}
