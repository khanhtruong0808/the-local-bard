"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { updateStageSchema } from "@/lib/form-schemas/stages";
import type { Database } from "@/lib/supabase/database.types";

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
    throw new Error(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const supabase = createServerActionClient<Database>({ cookies });

  const { error: stageError } = await supabase
    .from("stages")
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      notes: parsed.data.notes,
      wheelchair_accessible: parsed.data.wheelchair_accessible,
      seating_capacity: parsed.data.seating_capacity,
    })
    .eq("id", parsed.data.id);

  if (stageError) throw stageError;

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

  revalidatePath(`/account/stages/${parsed.data.id}`);
}
