"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateTheater(
  id: number,
  address_id: number,
  form: FormData,
) {
  const name = form.get("name") as string;
  const street_address = form.get("street_address") as string;
  const city = form.get("city") as string;
  const state = form.get("state") as string;
  const postal_code = form.get("postal_code") as string;
  const phone = form.get("phone") as string;
  const email = form.get("email") as string;
  const notes = form.get("notes") as string;
  const parking_instructions = form.get("parking_instructions") as string;
  const url = form.get("url") as string;
  const type = form.get("type") as string;
  const concessions = form.get("concessions") as string;

  const supabase = createServerActionClient({ cookies });

  const { error: theatersError } = await supabase
    .from("theaters")
    .update({
      name,
      phone,
      email,
      notes,
      parking_instructions,
      url,
      type,
      concessions,
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

  if (theatersError) {
    console.error(theatersError);
    throw new Error(theatersError.message);
  }
  if (addressesError) {
    console.error(addressesError);
    throw new Error(addressesError.message);
  }

  revalidatePath("/account/theater");
}
