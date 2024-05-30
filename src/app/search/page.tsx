import Link from "next/link";
import { Suspense } from "react";

import Map from "@/components/map";
import MapFilters from "@/components/map/MapFilters";
import MapMarkers from "@/components/map/MapMarkers";
import {
  MapProductionsList,
  MapProductionsListSkeleton,
} from "@/components/map/MapProductionsList";
import { Button } from "@/components/ui/button";
import { RouteSearchParams } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { q, productionId, stageId, lat, lng, searchDate, ...filters } =
    searchParams || {};

  const searchKey = JSON.stringify([filters, searchDate]);
  console.log(searchKey);

  // TODO: use zod or invariant to validate these params
  if (Array.isArray(q)) throw new Error("q must be a single value");
  if (Array.isArray(productionId))
    throw new Error("productionId must be a single value");
  if (Array.isArray(stageId)) throw new Error("stageId must be a single value");
  if (Array.isArray(lat)) throw new Error("lat must be a single value");
  if (Array.isArray(lng)) throw new Error("lng must be a single value");
  if (Array.isArray(searchDate))
    throw new Error("searchDate must be a single value");

  // This is meant to get all the defined non-filter search params from the URL
  // so that we can set the new URL to only have those params when the user
  // clears all filters.
  // TODO: find a better way to do this
  const clearSearchParams = new URLSearchParams();
  if (productionId !== undefined)
    clearSearchParams.set("productionId", productionId);
  if (stageId !== undefined) clearSearchParams.set("stageId", stageId || "");
  if (lat !== undefined) clearSearchParams.set("lat", lat || "");
  if (lng !== undefined) clearSearchParams.set("lng", lng || "");

  // TODO: make this page do different things based on mobile vs desktop
  return (
    <div className="flex grow">
      <div className="mx-auto flex h-full w-full flex-col items-start gap-x-4 md:flex-row">
        {/* Desktop Sidebar Filters */}
        <div className="sticky top-20 hidden w-60 shrink-0 px-8 md:block">
          <div className="mt-8 h-full w-full">
            <h2 className="text-xl font-semibold leading-9 tracking-tight text-white">
              Filters
            </h2>
            <MapFilters />
            <hr className="my-4 border-slate-500" />
            <div className="mt-8">
              <Button asChild>
                <Link href={`/search?${clearSearchParams.toString()}`}>
                  Clear Filters
                </Link>
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
            <Suspense key={searchKey} fallback={<MapProductionsListSkeleton />}>
              <MapProductionsList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
        <div className="sticky right-0 top-20 z-0 hidden h-[calc(100vh-5rem)] w-full xl:block">
          <Map>
            <Suspense key={`markers-${searchKey}`}>
              <MapMarkers searchParams={searchParams} />
            </Suspense>
          </Map>
        </div>
      </div>
    </div>
  );
}
