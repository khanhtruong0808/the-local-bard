import type { SupabaseClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

import { Database } from "./supabase/database.types";
import { getFullProductions } from "./supabase/queries";

export const fullProductionsQueryOptions = ({
  supabase,
  q,
  cost_range,
  genres,
  kid_friendly,
  searchDate,
}: {
  supabase: SupabaseClient<Database>;
  q: string | null;
  cost_range: string[] | null;
  genres: string[] | null;
  kid_friendly: boolean | null;
  searchDate: Date | null;
}) =>
  queryOptions({
    queryKey: ["productions", q, cost_range, genres, kid_friendly, searchDate],
    queryFn: () =>
      getFullProductions({
        client: supabase,
        search: q,
        cost_range,
        genres,
        kid_friendly,
        searchDate,
      }),
  });
