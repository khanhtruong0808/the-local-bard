"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function deleteProduction(id: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.from("productions").delete().eq("id", id);

  redirect("/account/productions");
}
