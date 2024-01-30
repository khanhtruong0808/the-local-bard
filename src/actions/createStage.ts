"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createStageSchema } from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";

export default async function createStage(form: FormData) {
  const parsed = createStageSchema.safeParse({
    name: form.get("name"),
    type: form.get("type"),
    notes: form.get("notes"),
    street_address: form.get("street_address"),
    city: form.get("city"),
    state: form.get("state"),
    postal_code: form.get("postal_code"),
    wheelchair_accessible: form.get("wheelchair_accessible"),
    seating_capacity: form.get("seating_capacity"),
  });
  if (!parsed.success) {
    return Promise.reject(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater } = await supabase
    .from("theaters")
    .select("id, theater_managers(user_id)")
    .eq("theater_managers.user_id", user.id)
    .order("id")
    .limit(1)
    .single();

  if (!theater) return Promise.reject("No theater found");

  const { data: address } = await supabase
    .from("addresses")
    .insert({
      street_address: parsed.data.street_address,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postal_code,
    })
    .select()
    .limit(1)
    .single();

  if (!address) {
    console.error("No address found");
    return Promise.reject("No address found");
  }

  const { error: stageError } = await supabase.from("stages").insert({
    theater_id: theater.id,
    name: parsed.data.name,
    type: parsed.data.type,
    notes: parsed.data.notes,
    wheelchair_accessible: parsed.data.wheelchair_accessible,
    seating_capacity: parsed.data.seating_capacity,
    address_id: address.id,
  });

  if (stageError) {
    console.error(stageError);
    return Promise.reject(stageError.message);
  }

  // update profile with user information so that they can edit the address
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    address_id: address.id,
  });

  if (profileError) {
    console.error(profileError);
    throw new Error(profileError.message);
  }

  return { status: "success" };
}
