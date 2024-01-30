"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateStageSchema } from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";

export default async function updateStage(form: FormData) {
  const parsed = updateStageSchema.safeParse({
    id: form.get("id"),
    address_id: form.get("address_id"),
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

  const payload = parsed.data;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: stageError } = await supabase
    .from("stages")
    .update({
      name: payload.name,
      type: payload.type,
      notes: payload.notes,
      wheelchair_accessible: payload.wheelchair_accessible,
      seating_capacity: payload.seating_capacity,
    })
    .eq("id", payload.id ?? 0);

  if (stageError) return Promise.reject(stageError.message);

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address: payload.street_address,
      city: payload.city,
      state: payload.state,
      postal_code: payload.postal_code,
    })
    .eq("id", payload.address_id ?? 0);

  if (addressesError) return Promise.reject(addressesError.message);

  revalidatePath(`/account/stages/${payload.id}`);

  return { status: "success" };
}
