import { createClient } from "@/lib/supabase/server";
import { ProfileDropdown } from "./ProfileDropdown";
import { getMaybeUser } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function Auth() {
  const supabase = await createClient();
  const user = await getMaybeUser(supabase);
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const name =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : user.email;

  return (
    <div className="flex">
      <div className="flex items-center">
        <p className="text-sm text-zinc-300">{name}</p>
      </div>
      <ProfileDropdown
        name={name}
        profileUrl={profile?.profile_image_url || undefined}
      />
    </div>
  );
}
