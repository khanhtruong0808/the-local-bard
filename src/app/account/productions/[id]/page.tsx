import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { NotAuthorized } from "@/components/NotAuthorized";
import { UpdateProductionForm } from "@/components/forms/UpdateProductionForm";
import { getProductionForUpdate, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function EditProductionPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let user: User | undefined;
  try {
    user = await getUser(supabase);
  } catch (e) {
    console.error(e);
    redirect("/login");
  }

  const { data: production, error } = await getProductionForUpdate(
    supabase,
    params.id,
  );

  if (!production) redirect("/account/productions");

  if (!production.theaters)
    throw new Error(`No theater found for production ${params.id}.`);
  if (production.theaters.manager_id !== user.id) {
    console.error(
      `User ${user.id} is not authorized to update production ${params.id}, which has theater manager ${production.theaters.manager_id}.`,
    );
    return <NotAuthorized />;
  }
  return <UpdateProductionForm production={production} />;
}
