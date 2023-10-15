"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateStage(
  id: number,
  address_id: number,
  form: FormData,
) {
  const name = form.get("name") as string;
  const type = form.get("type") as string;
  const notes = form.get("notes") as string;
  const street_address = form.get("street_address") as string;
  const city = form.get("city") as string;
  const state = form.get("state") as string;
  const postal_code = form.get("postal_code") as string;
  const wheelchair_accessible = form.get("wheelchair_accessible") as string;
  const seating_capacity = form.get("seating_capacity") as string;

  const supabase = createServerActionClient({ cookies });

  const { error: stageError } = await supabase
    .from("stages")
    .update({
      name,
      type,
      notes,
      wheelchair_accessible,
      seating_capacity,
    })
    .eq("id", id);

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address,
      city,
      state,
      postal_code,
    })
    .eq("id", address_id);

  if (stageError) {
    console.error(stageError);
    throw new Error(stageError.message);
  }
  if (addressesError) {
    console.error(addressesError);
    throw new Error(addressesError.message);
  }
  revalidatePath(`/account/stages/${id}`);
}
