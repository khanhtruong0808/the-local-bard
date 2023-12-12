"use server";

import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { getFullProductions } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import MapMarker from "./MapMarker";
import { type RouteSearchParams } from "@/lib/types";

export default async function MapMarkers({
  searchParams,
}: {
  searchParams?: RouteSearchParams;
}) {
  const { productionId, lat, lng, ...filters } = searchParams || {};
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: productions, error } = await getFullProductions(
    supabase,
    filters,
  );
  if (error) throw error;
  if (!productions) return null;

  const uniqueAddressIds: number[] = [];

  productions.forEach((production) => {
    const address = production.theaters?.addresses;
    if (address != null && !uniqueAddressIds.includes(address.id)) {
      uniqueAddressIds.push(address.id);
    }
  });

  const content = uniqueAddressIds.map((addressId) => {
    const productionsAtAddress = productions.filter(
      (production) => production.theaters?.addresses?.id === addressId,
    );

    if (productionsAtAddress.length === 0) {
      return null;
    }

    if (productionsAtAddress.length === 1) {
      const production = productionsAtAddress[0];
      const lat = production?.theaters?.addresses?.latitude;
      const lng = production?.theaters?.addresses?.longitude;

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
              <p>{production.theaters?.addresses?.street_address}</p>
              <p>
                {production.theaters?.addresses?.city},{" "}
                {production.theaters?.addresses?.state}
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
    const lat = productionsAtAddress[0]?.theaters?.addresses?.latitude;
    const lng = productionsAtAddress[0]?.theaters?.addresses?.longitude;

    if (lat == null || lng == null) {
      return null;
    }

    return (
      <MapMarker
        key={productionsAtAddress[0].id}
        productionId={productionsAtAddress[0].id}
        position={{ lat, lng }}
      >
        <div className="space-y-8 divide-y-2">
          {productionsAtAddress.map((production) => (
            <div key={production.id}>
              <h3 className="text-lg">{production.name}</h3>
              <div className="mt-2 text-sm">
                <p>Theater: {production.theaters?.name}</p>
                <p>Stage: {production.stages?.name}</p>
                <p>{production.theaters?.addresses?.street_address}</p>
                <p>
                  {production.theaters?.addresses?.city},{" "}
                  {production.theaters?.addresses?.state}
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
          ))}
        </div>
      </MapMarker>
    );
  });

  return <>{content}</>;
}
