import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SecondaryNavigation } from "@/components/SecondaryNavigation";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await getUser(supabase);
  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl lg:flex lg:gap-x-16">
        <SecondaryNavigation />
        <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          {children}
        </div>
      </div>
    </div>
  );
}
