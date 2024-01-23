"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  UpdateTheaterSchema,
  updateTheaterSchema,
} from "@/lib/form-schemas/theaters";
import { createClient } from "@/lib/supabase/server";

export default async function updateTheater(form: UpdateTheaterSchema) {
  const parsed = updateTheaterSchema.safeParse({
    id: form.id,
    address_id: form.address_id,
    name: form.name,
    street_address: form.street_address,
    city: form.city,
    state: form.state,
    postal_code: form.postal_code,
    notes: form.notes,
    parking_instructions: form.parking_instructions,
    url: form.url,
    type: form.type,
    concessions: form.concessions,
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
