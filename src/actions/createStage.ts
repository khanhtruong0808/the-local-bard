"use server";

import { cookies } from "next/headers";

import {
  CreateStageSchema,
  createStageSchema,
} from "@/lib/form-schemas/stages";
import { createClient } from "@/lib/supabase/server";
import { type FormServerState } from "@/lib/types";
import { ynToBool } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater } = await supabase
    .from("theaters")
    .select("id")
    .eq("manager_id", user.id)
    .order("id")
    .limit(1)
    .single();

  if (!theater) return Promise.reject("No theater found");

  const { data: address } = await supabase
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

  // update profile with user information so that they can edit the address
  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: user.id,
    email: user.email,
    address_id: address.id,
  });

  if (profileError) {
    console.error(profileError);
    throw new Error(profileError.message);
  }

  revalidatePath("/account/stages");

  return { status: "success" };
}
