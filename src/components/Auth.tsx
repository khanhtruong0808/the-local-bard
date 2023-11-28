import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import Button from "./ui/Button";
import { ProfileDropdown } from "./ProfileDropdown";

export const dynamic = "force-dynamic";

export async function Auth() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
