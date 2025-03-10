import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { createSerializer, type SearchParams } from "nuqs/server";

import MapFilters from "@/components/map/filters";
import { Map } from "@/components/map/map";
import { MapProductionsList } from "@/components/map/productions-list";
import { Button } from "@/components/ui/button";
import { fullProductionsQueryOptions } from "@/lib/queryOptions";
import { createClient } from "@/lib/supabase/server";
import { loadMapPageSearchParams, mapPageSearchParams } from "./search-params";

// This is named search page and not Map Page because there is no map on mobile.
export default async function SearchPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // These search params are not necessarily validated yet until we parse with zod
  const {
    q,
    productionId,
    stageId,
    lat,
    lng,
    cost_range,
    genres,
    kid_friendly,
    searchDate,
  } = await loadMapPageSearchParams(props.searchParams);

  const queryClient = new QueryClient();
  const supabase = await createClient();

  queryClient.prefetchQuery(
    fullProductionsQueryOptions({
      supabase,
      q,
      cost_range,
      genres,
      kid_friendly,
      searchDate,
    }),
  );

  const serialize = createSerializer(mapPageSearchParams);

  // Use this URL as a link to clear filters.
  const clearFiltersUrl = serialize("/search", {
    q,
    productionId,
    stageId,
    lat,
    lng,
    cost_range: null,
    genres: null,
    kid_friendly: null,
    searchDate: null,
  });

  // TODO: make this page do different things based on mobile vs desktop
  return (
    <div className="flex grow">
      <div className="mx-auto flex h-full w-full flex-col items-start gap-x-4 md:flex-row">
        {/* Desktop Sidebar Filters */}
        <div className="sticky top-20 hidden w-60 shrink-0 px-8 md:block">
          <div className="mt-8 h-full w-full">
            <h2 className="text-xl leading-9 font-semibold tracking-tight text-white">
              Filters
            </h2>
            <MapFilters />
            <hr className="my-4 border-slate-500" />
            <div className="mt-8">
              <Button asChild>
                <Link href={clearFiltersUrl}>Clear Filters</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        <div className="w-full md:hidden">
          <MapFilters />
        </div>

        {/* Sidebar Productions List */}
        <div className="relative z-10 w-full shrink-0 px-4 py-4 md:w-96">
          <div className="flex h-full w-full flex-col gap-y-4">
            <MapProductionsList />
          </div>
        </div>
        <div className="sticky top-20 right-0 z-0 hidden h-[calc(100vh-5rem)] w-full xl:block">
          <Map />
        </div>
      </div>
    </div>
  );
}
