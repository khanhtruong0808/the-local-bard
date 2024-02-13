import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { ProfileDropdown } from "./ProfileDropdown";

export const dynamic = "force-dynamic";

export async function Auth() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData) {
    console.error(error);
    return null;
  }

  console.log(userData);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .limit(1)
    .single();

  console.log(profile);

  const name =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : userData.user.email;

  return (
    <div className="flex">
      <div className="flex items-center">
        <p className="text-sm text-zinc-300">{name}</p>
      </div>
      <ProfileDropdown name={name} />
    </div>
  );
}
