import { NoTheater } from "@/components/NoTheater";
import { TheaterForm } from "@/components/forms/TheaterForm";
import { getTheaterForTheaterPage } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function GeneralPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater, error } = await getTheaterForTheaterPage(
    supabase,
    user.id,
  );
  if (error) throw new Error(error.message);
  if (!theater) return <NoTheater />;

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <TheaterForm theater={theater} />
    </div>
  );
}
