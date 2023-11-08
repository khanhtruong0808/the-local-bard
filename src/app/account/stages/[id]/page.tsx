import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UpdateStageForm } from "@/components/UpdateStageForm";
import { StageWithAddress, getStageWithAddress } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function EditStagePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  //TODO: Need to redirect page to something else if the user is not a theater manager
  // for the associated theater's stage

  const { data: stage } = await getStageWithAddress(
    supabase,
    Number(params.id),
  );

  if (!stage) redirect("/account/stages");

  // TODO: This is a hack to get around the fact that the stage returned from
  // the query is typed with an array of addresses for some reason whereas the
  // actual return value is an object with a single address.
  const stageWithAddress = stage as unknown as StageWithAddress;

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <UpdateStageForm stage={stageWithAddress} />
    </div>
  );
}
