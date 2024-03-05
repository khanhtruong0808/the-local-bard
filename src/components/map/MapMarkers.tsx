"use server";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import MapMarker from "./MapMarker";
import { type RouteSearchParams } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function MapMarkers({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { q, productionId, stageId, lat, lng, ...filters } = searchParams || {};
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: productions, error } = await getFullProductions(
    supabase,
    filters,
    q,
  );
  if (error) throw error;
  if (!productions) return null;

  const uniqueAddressIds: number[] = [];

  productions.forEach((production) => {
    const address = production.stages?.addresses;
    if (address != null && !uniqueAddressIds.includes(address.id)) {
      uniqueAddressIds.push(address.id);
    }
  });

  const content = uniqueAddressIds.map((addressId) => {
    const productionsAtAddress = productions.filter(
      (production) => production.stages?.addresses?.id === addressId,
    );

    if (productionsAtAddress.length === 0) {
      return null;
    }

    if (productionsAtAddress.length === 1) {
      const production = productionsAtAddress[0];
      const lat = production?.stages?.addresses?.latitude;
      const lng = production?.stages?.addresses?.longitude;

      if (lat == null || lng == null) {
        return null;
      }

      return (
        <MapMarker
          key={production.id}
          productionId={production.id}
          position={{ lat, lng }}
        >
          <div>
            <h3 className="text-lg">{production.name}</h3>
            <div className="mt-2 text-sm">
              <p>Theater: {production.theaters?.name}</p>
              <p>Stage: {production.stages?.name}</p>
              <p>{production.stages?.addresses?.street_address}</p>
              <p>
                {production.stages?.addresses?.city},{" "}
                {production.stages?.addresses?.state}
              </p>
            </div>
            <div className="mt-2">
              <p>Cost: {production.cost_range}</p>
              <p>Duration: {production.duration_minutes} mins.</p>
            </div>
            <div className="mt-2">
              {production.url && (
                <Link
                  href={production.url}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Click for more info
                </Link>
              )}
            </div>
            {production.poster_url && (
              <Image
                className="mt-2"
                src={production.poster_url}
                alt={production.name || "Production poster"}
                width={300}
                height={300}
              />
            )}
          </div>
        </MapMarker>
      );
    }

    // Else group productions together into one marker
    const lat = productionsAtAddress[0]?.stages?.addresses?.latitude;
    const lng = productionsAtAddress[0]?.stages?.addresses?.longitude;

    if (lat == null || lng == null) {
      return null;
    }

    return (
      <MapMarker
        key={productionsAtAddress[0].id}
        stageId={productionsAtAddress[0].stages?.id}
        productionId={productionsAtAddress[0].id}
        groupedProductionIds={productionsAtAddress.map((p) => p.id)}
        position={{ lat, lng }}
      >
        <div className="mx-auto max-h-[50vh] p-4 lg:max-w-7xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Productions at {productionsAtAddress[0].stages?.name}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-3 lg:gap-y-5 xl:grid-cols-4 xl:gap-x-4">
            {productionsAtAddress.map((production) => (
              <div
                key={production.id}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white",
                  production.id.toString() === productionId &&
                    "ring-4 ring-fuchsia-600 ring-offset-2",
                )}
              >
                <div className="aspect-h-4 aspect-w-3 bg-gray-200 group-hover:opacity-75">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.poster_url || "Production poster"}
                      className="h-full w-full object-fill object-center sm:h-full sm:w-full"
                      fill
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {production.url && (
                      <Link href={production.url} target="_blank">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {production.name}
                      </Link>
                    )}
                  </h3>
                  <p className="truncate text-sm text-gray-500">
                    {production.summary}
                  </p>
                  <div className="flex flex-1 flex-col justify-end">
                    <p className="text-sm italic text-gray-500">
                      Length: {production.duration_minutes} mins.
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {production.cost_range}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MapMarker>
    );
  });

  return <>{content}</>;
}
