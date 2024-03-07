"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  CreateStageSchema,
  createStageSchema,
} from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";
import { type FormServerState } from "@/lib/types";
import { ynToBool } from "@/lib/utils";
import { getUser } from "@/lib/supabase/queries";

export default async function createStage(
  currentState: FormServerState,
  form: CreateStageSchema,
): Promise<FormServerState> {
  const parsed = createStageSchema.safeParse(form);
  if (!parsed.success) {
    return Promise.reject(parsed.error.errors.map((e) => e.message).join("\n"));
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await getUser(supabase);

  const { data: theater } = await supabase
    .from("theaters")
    .select("id")
    .eq("manager_id", user.id)
    .order("id")
    .limit(1)
    .single();

  if (!theater) return Promise.reject("No theater found");

  const { data: address, error } = await supabase
    .from("addresses")
    .insert({
      street_address: parsed.data.street_address,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postal_code,
    })
    .select()
    .limit(1)
    .single();
  if (error) throw new Error(error.message);

  if (!address) {
    console.error("No address found");
    return Promise.reject("No address found");
  }

  const { error: stageError } = await supabase.from("stages").insert({
    theater_id: theater.id,
    name: parsed.data.name,
    type: parsed.data.type,
    notes: parsed.data.notes,
    wheelchair_accessible: ynToBool(parsed.data.wheelchair_accessible),
    seating_capacity: parsed.data.seating_capacity || undefined,
    address_id: address.id,
  });

  if (stageError) {
    console.error(stageError);
    return Promise.reject(stageError.message);
  }

  revalidatePath("/account/stages");

  return { status: "success" };
}
