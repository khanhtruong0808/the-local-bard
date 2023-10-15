"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function createStage(form: FormData) {
  const name = form.get("name") as string;
  const type = form.get("type") as string;
  const notes = form.get("notes") as string;
  const street_address = form.get("street_address") as string;
  const city = form.get("city") as string;
  const state = form.get("state") as string;
  const postal_code = form.get("postal_code") as unknown as number;
  const wheelchair_accessible = form.get("wheelchair_accessible") as string;
  const seating_capacity = form.get("seating_capacity") as unknown as number;

  const supabase = createServerActionClient({ cookies });

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

  if (!theater) throw new Error("No theater found");

  const { data: address } = await supabase
    .from("addresses")
    .insert({
      street_address,
      city,
      state,
      postal_code: postal_code || null,
    })
    .select()
    .limit(1)
    .single();

  if (!address) {
    console.error("No address found");
    throw new Error("No address found");
  }

  const { error: stageError } = await supabase.from("stages").insert({
    theater_id: theater.id,
    name,
    type,
    notes,
    wheelchair_accessible,
    seating_capacity: seating_capacity || null,
    address_id: address.id,
  });

  if (stageError) {
    console.error(stageError);
    throw new Error(stageError.message);
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

  redirect("/account/stages");
}
