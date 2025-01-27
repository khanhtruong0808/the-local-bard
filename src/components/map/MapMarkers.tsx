"use server";

import Image from "next/image";

import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { type RouteSearchParams } from "@/lib/types";
import MapMarker from "./MapMarker";
import Link from "next/link";

export default async function MapMarkers({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { q, productionId, stageId, lat, lng, searchDate, ...filters } =
    searchParams || {};

  if (Array.isArray(productionId))
    throw new Error("productionId must be a single value");

  const supabase = await createClient();

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
            <div className="shrink-0">
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

    const mainProductionId =
      productionId &&
      productionsAtAddress.find((p) => p.id === parseInt(productionId))
        ? parseInt(productionId)
        : productionsAtAddress[0].id;

    const mainProduction = productionsAtAddress.find(
      (p) => p.id === mainProductionId,
    );

    if (!mainProduction) throw new Error("mainProduction not found");

    const orderedProductionsAtAddress = [
      mainProduction,
      ...productionsAtAddress.filter((p) => p.id !== mainProductionId),
    ];

    return (
      <MapMarker
        key={mainProductionId}
        stageId={mainProduction.stages?.id}
        productions={orderedProductionsAtAddress}
        productionId={mainProductionId}
        groupedProductionIds={orderedProductionsAtAddress.map((p) => p.id)}
        position={{ lat, lng }}
      >
        <div className="flex flex-row -space-x-16">
          {orderedProductionsAtAddress.toReversed().map((production, i) => {
            if (!production.poster_url) return null;
            return (
              <div
                className="bg-opacity-75 border bg-yellow-400 shadow-lg"
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
