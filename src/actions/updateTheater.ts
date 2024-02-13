"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  updateTheaterSchema,
  type UpdateTheaterSchema,
} from "@/lib/form-schemas/theaters";
import { createClient } from "@/lib/supabase/server";
import { type FormServerState } from "@/lib/types";

export default async function updateTheater(
  currentState: FormServerState,
  form: UpdateTheaterSchema,
): Promise<FormServerState> {
  const parsed = updateTheaterSchema.safeParse(form);

  if (!parsed.success) {
    const error = parsed.error.errors.map((e) => e.message).join("\n");
    return { status: "error", error };
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

  if (theatersError) {
    console.error(theatersError);
    return { status: "error", error: theatersError.message };
  }

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address: payload.street_address,
      city: payload.city,
      state: payload.state,
      postal_code: payload.postal_code,
    })
    .eq("id", payload.address_id || "");

  if (addressesError) {
    console.error(addressesError);
    return { status: "error", error: addressesError.message };
  }

  revalidatePath("/account/theater");

  return { status: "success" };
}
