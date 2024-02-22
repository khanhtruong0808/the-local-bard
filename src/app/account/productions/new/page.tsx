import { cookies } from "next/headers";

import { NoTheater } from "@/components/NoTheater";
import { CreateProductionForm } from "@/components/forms/CreateProductionForm";
import { getTheaterForNewProduction, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductionPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await getUser(supabase);

  const { data: theater, error } = await getTheaterForNewProduction(
    supabase,
    user.id,
  );
  if (error) throw new Error(error.message);
  if (!theater) return <NoTheater />;

  return <CreateProductionForm theater={theater} />;
}
