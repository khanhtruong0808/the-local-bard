import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UpdateStageForm } from "@/components/forms/UpdateStageForm";
import {
  StageWithAddress,
  getStageWithAddress,
  getUser,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NotAuthorized } from "@/components/NotAuthorized";

export default async function EditStagePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await getUser(supabase);

  const { data: stage } = await getStageWithAddress(
    supabase,
    Number(params.id),
  );

  if (!stage) redirect("/account/stages");

  if (stage.theaters?.manager_id !== user.id) return <NotAuthorized />;

  // TODO: This is a hack to get around the fact that the stage returned from
  // the query is typed with an array of addresses for some reason whereas the
  // actual return value is an object with a single address.
  const stageWithAddress = stage as unknown as StageWithAddress;

  return <UpdateStageForm stage={stageWithAddress} />;
}
