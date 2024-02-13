"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  UpdateStageSchema,
  updateStageSchema,
} from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";
import { ynToBool } from "@/lib/utils";
import { type FormServerState } from "@/lib/types";

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

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: stageError } = await supabase
    .from("stages")
    .update({
      name: payload.name,
      type: payload.type,
      notes: payload.notes,
      wheelchair_accessible: ynToBool(payload.wheelchair_accessible),
      seating_capacity: payload.seating_capacity,
    })
    .eq("id", payload.id);

  if (stageError) return Promise.reject(stageError.message);

  const { error: addressesError } = await supabase
    .from("addresses")
    .update({
      street_address: payload.street_address,
      city: payload.city,
      state: payload.state,
      postal_code: payload.postal_code,
    })
    .eq("id", payload.address_id);

  if (addressesError) return { status: "error", error: addressesError.message };

  revalidatePath(`/account/stages/${payload.id}`);

  return { status: "success" };
}
