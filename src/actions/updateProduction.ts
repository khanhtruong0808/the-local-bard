"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateProductionSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";

export default async function updateProduction(form: FormData) {
  const parsed = updateProductionSchema.safeParse({
    id: form.get("id"),
    name: form.get("name"),
    summary: form.get("summary"),
    stage_id: form.get("stage_id"),
    writers: form.get("writers"),
    directors: form.get("directors"),
    composers: form.get("composers"),
    type: form.get("type"),
    kid_friendly: form.get("kid_friendly"),
    cost_range: form.get("cost_range"),
    duration_minutes: form.get("duration_minutes"),
    poster: form.get("poster"),
    url: form.get("url"),
    notes: form.get("notes"),
    start_date: form.get("start_date"),
    end_date: form.get("end_date"),
  });

  if (!parsed.success) {
    return Promise.reject(
      parsed.error.errors.map((e) => `${e.path}: ${e.message}`).join("\n"),
    );
  }

  const payload = parsed.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (payload.poster && payload.poster.size > 0) {
    const { error: fileError } = await supabase.storage
      .from("posters")
      .upload(payload.poster.name, payload.poster, {
        upsert: true,
      });

    if (fileError) {
      throw fileError;
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(payload.poster.name);

    const { publicUrl: poster_url } = data;
    payload.poster_url = poster_url;
  } else {
    // TODO: Figure out how to actually delete orphaned posters from storage?
    // keep old poster_url if no file is given
  }

  const { id, poster, ...updatedProduction } = payload;

  const { error } = await supabase
    .from("productions")
    .update(updatedProduction)
    .eq("id", id);

  if (error) {
    console.error(error);
    return Promise.reject(error.message);
  }

  revalidatePath(`/account/productions/${id}`);

  return { status: "success" };
}
