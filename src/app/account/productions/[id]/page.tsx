import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UpdateProductionForm } from "@/components/forms/UpdateProductionForm";
import {
  getProduction,
  getTheaterForUpdateProduction,
  getUser,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NoTheater } from "@/components/NoTheater";
import { NotAuthorized } from "@/components/NotAuthorized";

export default async function EditProductionPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await getUser(supabase);

  const { data: production } = await getProduction(supabase, params.id);
  if (!production) redirect("/account/productions");

  const { data: theater, error } = await getTheaterForUpdateProduction(
    supabase,
    params.id,
  );
  if (error) throw new Error(error.message);
  if (!theater)
    throw new Error(`No theater found for production ${params.id}.`);
  if (theater.manager_id !== user.id) return <NotAuthorized />;

  return <UpdateProductionForm production={production} theater={theater} />;
}
