"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateProduction(id: number, form: FormData) {
  const name = form.get("title") as string;
  const summary = form.get("summary") as string;
  const stage_id = form.get("stage") as string;
  const playwrights = form.get("playwrights") as string;
  const writers = playwrights
    ? playwrights.replace(/\s*,\s*/g, ",").split(",")
    : [];
  const directors_string = form.get("directors") as string;
  const directors = directors_string
    ? directors_string.replace(/\s*,\s*/g, ",").split(",")
    : [];
  const composers_string = form.get("composers") as string;
  const composers = composers_string
    ? composers_string.replace(/\s*,\s*/g, ",").split(",")
    : [];
  const type = form.get("genre") as string;
  const kid_friendly = form.get("kidFriendly") as string;
  const cost_range = form.get("costRange") as string;
  const duration_minutes = form.get("duration") as unknown as number;
  const poster_file = form.get("poster") as File;
  const url = form.get("url") as string;
  const notes = form.get("notes") as string;
  const start_date = form.get("openingNight") as string;
  const end_date = form.get("closingNight") as string;

  const supabase = createServerActionClient({ cookies });

  if (poster_file.size > 0) {
    const { error: fileError } = await supabase.storage
      .from("posters")
      .upload(poster_file.name, poster_file, {
        upsert: true,
      });

    if (fileError) {
      console.error(fileError);
      throw new Error(fileError.message);
    }

    const { data } = supabase.storage
      .from("posters")
      .getPublicUrl(poster_file.name);

    const { publicUrl: poster_url } = data;

    const { error: posterError } = await supabase
      .from("productions")
      .update({ poster_url })
      .eq("id", id);

    if (posterError) {
      console.error(posterError);
      throw new Error(posterError.message);
    }
  }

  const { error } = await supabase
    .from("productions")
    .update({
      stage_id,
      name,
      summary,
      writers,
      directors,
      composers,
      type,
      kid_friendly,
      cost_range,
      duration_minutes,
      start_date,
      end_date,
      notes,
      url,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath(`/account/productions/${id}`);
}
