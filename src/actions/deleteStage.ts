"use server";
import { createClient } from "@/lib/supabase/server";
import { FormServerState } from "@/lib/types";
import { cookies } from "next/headers";

export default async function deleteStage(
  id: number,
): Promise<FormServerState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Check for any productions that are using this stage
  const { data: productions, error: productionError } = await supabase
    .from("productions")
    .select("id")
    .eq("stage_id", id);

  if (productionError) {
    console.error(productionError);
    return { status: "error", error: productionError.message };
  }

  if (productions.length > 0) {
    return {
      status: "error",
      error: "This stage is in use by a production and cannot be deleted.",
    };
  }

  const { error } = await supabase.from("stages").delete().eq("id", id);

  if (error) {
    console.log(error);
    return { status: "error", error: error.message };
  }

  return { status: "success" };
}
