"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function deleteProduction(id: number) {
  const supabase = createClient();

  await supabase.from("productions").delete().eq("id", id);

  redirect("/account/productions");
}
