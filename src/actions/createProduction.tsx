"use server";

import { Database } from "@/lib/supabase/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createProductionSchema } from "@/lib/form-schemas/productions";

export default async function createProduction(form: FormData) {
  const parsed = createProductionSchema.safeParse({
    theater_id: form.get("theater_id"),
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

  const supabase = createServerActionClient<Database>({ cookies });

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

    const { publicUrl } = data;
    parsed.data.poster_url = publicUrl;
  }

  // omit the actual file from the data we send to the database
  const { poster, ...newProduction } = parsed.data;
  const { error } = await supabase.from("productions").insert(newProduction);

  if (error) {
    throw error;
  }

  redirect("/account/productions");
}
