"use server";

import { revalidatePath } from "next/cache";

import {
  UpdateStageSchema,
  updateStageSchema,
} from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";
import type { FormServerState } from "@/lib/types";

export default async function updateStage(
  currentState: FormServerState,
  form: UpdateStageSchema,
): Promise<FormServerState> {
  const parsed = updateStageSchema.safeParse(form);
  if (!parsed.success) {
    const error = parsed.error.errors.map((e) => e.message).join("\n");
    return { status: "error", error: error };
  }

  const payload = parsed.data;

  const supabase = await createClient();

  // Prefer to create a new address, rather than update an existing one.
  // We can always delete unused addresses later with an RPC.
  const { data: addressData, error: addressesError } = await supabase
    .from("addresses")
    .insert({
      street_address: payload.street_address,
      city: payload.city,
      state: payload.state,
      postal_code: payload.postal_code,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .select()
    .limit(1)
    .single();

  if (addressesError) return { status: "error", error: addressesError.message };

  const { error: stageError } = await supabase
    .from("stages")
    .update({
      name: payload.name,
      type: payload.type,
      notes: payload.notes,
      address_id: addressData.id,
    })
    .eq("id", payload.id);

  if (stageError) return Promise.reject(stageError.message);

  revalidatePath(`/account/stages/${payload.id}`);

  return { status: "success" };
}
