import { cookies } from "next/headers";

import Map from "@/components/map";
import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const filters: Record<string, string> = {};
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      // Skip lat and lng because they are only used by the map.
      if (key === "lat" || key === "lng") {
        return;
      }

      // TODO: implement array filters
      if (Array.isArray(value)) {
        return;
      }

      if (value !== undefined) {
        filters[key] = value;
      }
    });
  }

  const { data: productions, error } = await getFullProductions(
    supabase,
    filters,
  );
  if (error) throw error;

  // TODO: make this page do different things based on mobile vs desktop
  return (
    <div className="flex grow">
      <Map productions={productions} />
    </div>
  );
}
