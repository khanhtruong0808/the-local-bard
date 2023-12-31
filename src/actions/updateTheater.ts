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
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: theatersError } = await supabase
    .from("theaters")
    .update({
      name: parsed.data.name,
      notes: parsed.data.notes,
      parking_instructions: parsed.data.parking_instructions,
      url: parsed.data.url,
      type: parsed.data.type,
      concessions: parsed.data.concessions,
    })
    .eq("id", parsed.data.id);

  if (theatersError) throw theatersError;

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address: parsed.data.street_address,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postal_code,
    })
    .eq("id", parsed.data.address_id);

  if (addressesError) throw addressesError;

  revalidatePath("/account/theater");
}
