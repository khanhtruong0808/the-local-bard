import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { TheaterForm } from "@/components/TheaterForm";
import { getTheaterForTheaterPage } from "@/lib/supabase/queries";
import type { Database } from "@/lib/supabase/database.types";

export default async function GeneralPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater, error } = await getTheaterForTheaterPage(
    supabase,
    user.id,
  );
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  if (!theater) throw new Error("No theater associated with user");

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <TheaterForm theater={theater} />
      </div>
    </div>
  );
}
