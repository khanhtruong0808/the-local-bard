import { NoTheater } from "@/components/NoTheater";
import { CreateStageForm } from "@/components/forms/CreateStageForm";
import { getTheaterForStagesPage, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function EditStagePage() {
  const supabase = createClient();

  const user = await getUser(supabase);

  const { data: theater, error } = await getTheaterForStagesPage(
    supabase,
    user.id,
  );
  if (error) throw new Error(error.message);
  if (!theater) return <NoTheater />;

  return <CreateStageForm />;
}
