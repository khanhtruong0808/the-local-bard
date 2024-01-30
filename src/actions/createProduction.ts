"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createProductionSchema } from "@/lib/form-schemas/productions";
import { createClient } from "@/lib/supabase/server";

export default async function createProduction(form: FormData) {
  const parsed = createProductionSchema.safeParse({
    theater_id: form.get("theater_id"),
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
      new Error(parsed.error.errors.map((e) => e.message).join("\n")),
    );
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
      throw fileError.message;
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
    throw error.message;
  }

  return { status: "success" };
}
