"use server";

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
  const supabase = createClient();
  await supabase.auth.getUser();

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
          <div className="w-full min-w-[400px] max-w-7xl">
            <div className="flex w-full justify-center">
              {production.poster_url && (
                <Image
                  className="mt-2 h-[200px] w-[150px]"
                  src={production.poster_url}
                  alt={production.name || "Production poster"}
                  width={200}
                  height={150}
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-xl font-semibold">{production.name}</h3>

              <div className="mt-2 text-sm">
                <p>
                  Presented by {production.theaters?.name} at{" "}
                  {production.stages?.name}
                </p>
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
            </div>
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
        <div className="mx-auto max-h-[50vh] w-full p-4 lg:max-w-7xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Productions at {productionsAtAddress[0].stages?.name}
          </h2>
          <div className="mt-4 flex justify-center gap-x-4">
            {productionsAtAddress.map((production) => (
              <div
                key={production.id}
                className={cn(
                  "group relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white",
                  production.id.toString() === productionId &&
                    "ring-4 ring-fuchsia-600 ring-offset-2",
                )}
              >
                <div className="flex justify-center group-hover:opacity-75">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.poster_url || "Production poster"}
                      className="h-[300px] w-[225px]"
                      width={300}
                      height={225}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {production.url ? (
                      <Link href={production.url} target="_blank">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {production.name}
                      </Link>
                    ) : (
                      production.name
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{production.summary}</p>
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
