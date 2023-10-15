import { CreateProductionForm } from "@/components/CreateProductionForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function NewProductionPage() {
  //TODO: Need to redirect page to something else if the user is not a theater manager
  // for the associated theater's production
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater } = await supabase
    .from("theaters")
    .select(
      "*, theater_managers(user_id), addresses(*), productions(*), stages(*)",
    )
    .eq("theater_managers.user_id", user.id)
    .order("id")
    .limit(1)
    .single();
  if (!theater) throw new Error("No theater associated with user");

  // TODO: Figure out how to type this correctly
  const { addresses } = theater;
  const { stages } = theater;

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <CreateProductionForm
        theater={theater}
        addresses={addresses}
        stages={stages}
      />
    </div>
  );
}
