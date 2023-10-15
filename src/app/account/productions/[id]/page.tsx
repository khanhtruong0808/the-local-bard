import { UpdateProductionForm } from "@/components/UpdateProductionForm";
import { Tables } from "@/lib/supabase/dbHelperTypes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditProductionPage({
  params,
}: {
  params: { id: string };
}) {
  //TODO: Need to redirect page to something else if the user is not a theater manager
  // for the associated theater's production
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data } = await supabase
    .from("productions")
    .select("*")
    .eq("id", params.id)
    .limit(1)
    .single();

  const production: Tables<"productions"> = data;
  if (!production) redirect("/account/productions");

  const { data: theater } = await supabase
    .from("theaters")
    .select(
      "*, theater_managers(user_id), addresses(*), productions(*), stages(*)",
    )
    .eq("theater_managers.user_id", user.id)
    .eq("productions.id", params.id)
    .order("id")
    .limit(1)
    .single();
  if (!theater) throw new Error("No theater associated with user");

  // TODO: Figure out how to type this correctly
  const { addresses } = theater as any;
  const { stages } = theater as any;

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <UpdateProductionForm
        production={production}
        theater={theater}
        addresses={addresses}
        stages={stages}
      />
    </div>
  );
}
