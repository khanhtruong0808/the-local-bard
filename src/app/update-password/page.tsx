import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UpdatePasswordAfterResetForm } from "./form";

export default async function UpdatePasswordAfterResetPage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Update Password
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <UpdatePasswordAfterResetForm />
      </div>
    </div>
  );
}
