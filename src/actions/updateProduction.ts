"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateProductionSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";

export default async function updateProduction(form: FormData) {
  const parsed = updateProductionSchema.safeParse({
    id: form.get("id"),
    name: form.get("title"),
    summary: form.get("summary"),
    stage_id: form.get("stage"),
    writers: form.get("playwrights"),
    directors: form.get("directors"),
    composers: form.get("composers"),
    type: form.get("genre"),
    kid_friendly: form.get("kidFriendly"),
    cost_range: form.get("costRange"),
    duration_minutes: form.get("duration"),
    poster: form.get("poster"),
    url: form.get("url"),
    notes: form.get("notes"),
    start_date: form.get("openingNight"),
    end_date: form.get("closingNight"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (parsed.data.poster.size > 0) {
    const { error: fileError } = await supabase.storage
      .from("posters")
      .upload(parsed.data.poster.name, parsed.data.poster, {
        upsert: true,
      });

    if (fileError) {
      throw fileError;
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(parsed.data.poster.name);

    const { publicUrl: poster_url } = data;
    parsed.data.poster_url = poster_url;
  } else {
    // TODO: Figure out how to actually delete orphaned posters from storage?
    // keep old poster_url if no file is given
  }

  const { id, poster, ...updatedProduction } = parsed.data;

  const { error } = await supabase
    .from("productions")
    .update(updatedProduction)
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error.message;
  }

  revalidatePath(`/account/productions/${id}`);
}
