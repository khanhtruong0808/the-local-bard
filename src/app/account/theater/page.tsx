import { TheaterForm } from "@/components/TheaterForm";
import { Tables } from "@/lib/supabase/dbHelperTypes";
// import { UserCircleIcon } from "@heroicons/react/20/solid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function GeneralPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater, error } = await supabase
    .from("theaters")
    .select("*, theater_managers(user_id), addresses(*)")
    .eq("theater_managers.user_id", user.id)
    .order("id")
    .limit(1)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  if (!theater) throw new Error("No theater associated with user");

  const { addresses } = theater;

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <TheaterForm theater={theater} addresses={addresses} />
      </div>
    </div>
  );
}
