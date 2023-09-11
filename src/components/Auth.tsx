import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Button from "./Button";
import { ProfileDropdown } from "./ProfileDropdown";

export const dynamic = "force-dynamic";

export async function Auth() {
  const supabase = createServerComponentClient({ cookies });

  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <Button variant="secondary" href="/login">
        Sign In
      </Button>
    );
  }

  return <ProfileDropdown />;
}
