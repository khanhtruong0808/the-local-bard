"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateTheaterSchema } from "@/lib/form-schemas/theaters";
import { createClient } from "@/lib/supabase/server";

export default async function updateTheater(form: FormData) {
  const parsed = updateTheaterSchema.safeParse({
    id: form.get("id"),
    address_id: form.get("address_id"),
    name: form.get("name"),
    street_address: form.get("street_address"),
    city: form.get("city"),
    state: form.get("state"),
    postal_code: form.get("postal_code"),
    notes: form.get("notes"),
    parking_instructions: form.get("parking_instructions"),
    url: form.get("url"),
    type: form.get("type"),
    concessions: form.get("concessions"),
  });

  if (!parsed.success) {
    return Promise.reject(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const payload = parsed.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: theatersError } = await supabase
    .from("theaters")
    .update({
      name: payload.name,
      notes: payload.notes,
      parking_instructions: payload.parking_instructions,
      url: payload.url,
      type: payload.type,
      concessions: payload.concessions,
    })
    .eq("id", payload.id || "");

  if (theatersError) throw theatersError;

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address: payload.street_address,
      city: payload.city,
      state: payload.state,
      postal_code: payload.postal_code,
    })
    .eq("id", payload.address_id || "");

  if (addressesError) throw addressesError;

  revalidatePath("/account/theater");

  return { status: "success" };
}
