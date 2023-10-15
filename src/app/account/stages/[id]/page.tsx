import Button from "@/components/Button";
import Input from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import { UpdateStageForm } from "@/components/UpdateStageForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditStagePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  //TODO: Need to redirect page to something else if the user is not a theater manager
  // for the associated theater's stage

  const { data: stage } = await supabase
    .from("stages")
    .select("*, addresses(*)")
    .eq("id", params.id)
    .single();

  if (!stage) redirect("/account/stages");

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <UpdateStageForm stage={stage} />
    </div>
  );
}
