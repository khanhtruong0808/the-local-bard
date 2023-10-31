import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { SecondaryNavigation } from "@/components/SecondaryNavigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl lg:flex lg:gap-x-16">
        <SecondaryNavigation />
        {children}
      </div>
    </div>
  );
}
