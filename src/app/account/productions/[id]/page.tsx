import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UpdateProductionForm } from "@/components/forms/UpdateProductionForm";
import {
  getProduction,
  getTheaterForUpdateProduction,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function EditProductionPage({
  params,
}: {
  params: { id: string };
}) {
  //TODO: Need to redirect page to something else if the user is not a theater manager
  // for the associated theater's production
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: production } = await getProduction(supabase, params.id);
  if (!production) redirect("/account/productions");

  const { data: theater } = await getTheaterForUpdateProduction(
    supabase,
    user.id,
    params.id,
  );
  if (!theater) throw new Error("No theater associated with user");

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <UpdateProductionForm production={production} theater={theater} />
    </div>
  );
}
