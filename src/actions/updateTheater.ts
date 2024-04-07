"use server";

import { revalidatePath } from "next/cache";

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

  const supabase = createClient();

  const { error: theatersError } = await supabase
    .from("theaters")
    .update({
      name: payload.name,
      notes: payload.notes,
      url: payload.url,
      type: payload.type,
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
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .eq("id", payload.address_id || "");

  if (addressesError) {
    console.error(addressesError);
    return { status: "error", error: addressesError.message };
  }

  revalidatePath("/account/theater");

  return { status: "success" };
}
