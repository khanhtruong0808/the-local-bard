import { Suspense } from "react";

import Map from "@/components/map";
import MapFilters from "@/components/map/MapFilters";
import MapMarkers from "@/components/map/MapMarkers";
import {
  MapProductionsList,
  MapProductionsListSkeleton,
} from "@/components/map/MapProductionsList";
import { RouteSearchParams } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { productionId, lat, lng, ...filters } = searchParams || {};
  const searchKey = JSON.stringify(filters);

  // TODO: make this page do different things based on mobile vs desktop
  return (
    <div className="flex grow">
      <div className="mx-auto flex h-full w-full items-start gap-x-4">
        {/* Sidebar Filters */}
        <div className="sticky top-20 hidden w-60 shrink-0 px-8 lg:block">
          <div className="mt-8 h-full w-full">
            <h2 className="text-xl font-semibold leading-9 tracking-tight text-white">
              Filters
            </h2>
            <MapFilters />
          </div>
        </div>
        {/* Sidebar Productions List */}
        <div className="relative z-10 w-96 shrink-0 px-4 py-4">
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
