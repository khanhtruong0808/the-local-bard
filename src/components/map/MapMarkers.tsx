"use server";

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
  const { q, productionId, stageId, lat, lng, searchDate, ...filters } =
    searchParams || {};
  const supabase = createClient();

  const { data: productions, error } = await getFullProductions(
    supabase,
    filters,
    q,
    searchDate,
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
            <div className="flex-shrink-0">
              <Image
                src={production.poster_url}
                alt={production.name}
                width={105}
                height={140}
                className="h-[140px] w-[105px]"
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
        <div className="flex flex-row -space-x-16">
          {productionsAtAddress.map((production, i) => {
            if (!production.poster_url) return null;
            return (
              <div
                className="border bg-yellow-400 bg-opacity-75 shadow-lg"
                key={i}
              >
                <Image
                  key={production.id}
                  src={production.poster_url}
                  alt={production.name}
                  width={105}
                  height={140}
                  style={{ zIndex: i }}
                  className="h-[140px] w-[105px]"
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
