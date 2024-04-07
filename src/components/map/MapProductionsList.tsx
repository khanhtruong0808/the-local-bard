"use server";

import Image from "next/image";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { RouteSearchParams } from "@/lib/types";
import { createUrl } from "@/lib/utils";

export async function MapProductionsList({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { q, productionId, stageId, lat, lng, ...filters } = searchParams || {};

  const nextSearchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        nextSearchParams.append(key, v);
      });
    } else {
      if (value === undefined) return;
      nextSearchParams.set(key, value);
    }
  });

  const supabase = createClient();
  await supabase.auth.getUser();

  const { data: productions, error } = await getFullProductions(
    supabase,
    filters,
    q,
  );

  if (error) throw new Error(error.message);
  if (!productions || productions.length === 0)
    return (
      <h3 className="mt-4 text-lg leading-9 tracking-tight text-slate-200">
        No results
      </h3>
    );

  return (
    <>
      {productions.map((production) => {
        const stage = production.stages;
        const stageAddress = stage?.addresses;
        nextSearchParams.set("productionId", production.id.toString());
        nextSearchParams.delete("stageId");
        if (stageAddress?.latitude && stageAddress?.longitude) {
          nextSearchParams.set("lat", stageAddress.latitude.toString());
          nextSearchParams.set("lng", stageAddress.longitude.toString());
        }
        return (
          <Link
            key={production.id}
            href={createUrl("/search", nextSearchParams)}
            prefetch={false}
            className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
          >
            <div className="sm:flex">
              <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                {production.poster_url && (
                  <div className="relative h-[100px] w-[75px]">
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      fill
                      sizes="75px"
                    />
                  </div>
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-zinc-200">
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
          </Link>
        );
      })}
    </>
  );
}

export async function MapProductionsListSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="h-32 w-full bg-zinc-700 opacity-75" key={i} />
      ))}
    </>
  );
}
