"use server";

import { cookies } from "next/headers";
import Image from "next/image";

import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { type RouteSearchParams } from "@/lib/types";
import MapMarker from "./MapMarker";

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
          productions={[production]}
          productionId={production.id}
          position={{ lat, lng }}
        >
          {production.poster_url && (
            <div className="relative h-[200px] w-[150px]">
              <Image
                src={production.poster_url}
                alt={production.name}
                fill
                sizes="150px"
              />
            </div>
          )}
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
        productions={productionsAtAddress}
        productionId={productionsAtAddress[0].id}
        groupedProductionIds={productionsAtAddress.map((p) => p.id)}
        position={{ lat, lng }}
      >
        <div className="flex flex-row gap-x-4">
          {productionsAtAddress.map((production) => {
            if (!production.poster_url) return null;
            return (
              <div key={production.id} className="relative h-[200px] w-[150px]">
                <Image
                  src={production.poster_url}
                  alt={production.name}
                  fill
                  sizes="150px"
                />
              </div>
            );
          })}
        </div>
      </MapMarker>
    );
  });

  return <>{content}</>;
}
