"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useCallback } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fullProductionsQueryOptions } from "@/lib/queryOptions";
import { createClient } from "@/lib/supabase/client";
import { FullProduction } from "@/lib/supabase/queries";

export function MapProductionsList() {
  const [searchParams, _setSearchParams] = useQueryStates({
    q: parseAsString,
    cost_range: parseAsArrayOf(parseAsStringEnum(["$", "$$", "$$$", "$$$$"])),
    genres: parseAsArrayOf(parseAsString),
    kid_friendly: parseAsBoolean,
    searchDate: parseAsIsoDate,
  });

  // setter func for production and stage IDs when we click on a production
  const [_ids, setIds] = useQueryStates({
    productionId: parseAsInteger,
    stageId: parseAsInteger,
  });

  // setter func for lat and lng when we click on a production
  const [_latLng, setLatLng] = useQueryStates({
    lat: parseAsFloat,
    lng: parseAsFloat,
  });

  const supabase = createClient();
  const queryClient = useQueryClient();
  const {
    data: productions,
    isLoading,
    error,
  } = useQuery(
    fullProductionsQueryOptions({
      supabase,
      q: searchParams.q,
      cost_range: searchParams.cost_range,
      genres: searchParams.genres,
      kid_friendly: searchParams.kid_friendly,
      searchDate: searchParams.searchDate,
    }),
    queryClient,
  );

  const handleProductionClick = useCallback(
    (production: FullProduction) => {
      setIds({
        productionId: production.id,
        stageId: null,
      });
      const stageAddress = production.stages?.addresses;
      if (stageAddress?.latitude && stageAddress?.longitude) {
        setLatLng({
          lat: stageAddress.latitude,
          lng: stageAddress.longitude,
        });
      }
    },
    [setIds, setLatLng],
  );

  if (error) throw new Error(error.message);
  if (isLoading) return <MapProductionsListSkeleton />;
  if (!productions || productions.length === 0)
    return (
      <h3 className="mt-4 text-lg leading-9 tracking-tight text-slate-200">
        No results
      </h3>
    );

  return (
    <>
      {/* Desktop */}
      {productions.map((production) => {
        const stage = production.stages;
        const stageAddress = stage?.addresses;
        return (
          <div
            key={production.id}
            onClick={() => handleProductionClick(production)}
            className="hidden w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow-sm hover:bg-zinc-600 md:block"
          >
            <div className="sm:flex">
              <div className="ml-2 shrink-0 self-center pl-4 sm:mr-4 sm:mb-0">
                {production.poster_url && (
                  <Image
                    src={production.poster_url}
                    alt={production.name || "Production poster"}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-zinc-200">
                  {production.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-zinc-400">
                  <p>{stage?.name}</p>
                  <p>{stageAddress?.street_address}</p>
                  <p>
                    {stageAddress?.city}, {stageAddress?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Mobile */}
      {productions.map((production) => {
        const stage = production.stages;
        const stageAddress = stage?.addresses;

        return (
          <div
            key={production.id}
            onClick={() => handleProductionClick(production)}
            className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 py-2 shadow-sm hover:bg-zinc-600 md:hidden"
          >
            <div className="flex">
              <div className="ml-2 shrink-0 self-center pl-4 sm:mr-4 sm:mb-0">
                {production.poster_url && (
                  <Image
                    src={production.poster_url}
                    alt={production.name || "Production poster"}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-zinc-200">
                  {production.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-zinc-400">
                  <p>{stage?.name}</p>
                  <p>{stageAddress?.street_address}</p>
                  <p>
                    {stageAddress?.city}, {stageAddress?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function MapProductionsListSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="h-32 w-full bg-zinc-700 opacity-75" key={i} />
      ))}
    </>
  );
}
