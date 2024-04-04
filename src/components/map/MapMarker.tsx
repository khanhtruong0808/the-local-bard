"use client";

import type { FullProductions } from "@/lib/supabase/queries";
import { cn, createUrl } from "@/lib/utils";
import {
  AdvancedMarker,
  AdvancedMarkerProps,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MapMarkerProps extends AdvancedMarkerProps {
  productions: FullProductions;
  productionId: number;
  stageId?: number;
  groupedProductionIds?: number[];
}

export default function MapMarker({
  productions,
  productionId,
  stageId,
  groupedProductionIds,
  position,
  children,
}: MapMarkerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const map = useMap();

  const [markerRef, marker] = useAdvancedMarkerRef();

  if (!position) {
    console.error("MapMarker must have a position prop");
    return null;
  }

  if (!productions || productions.length === 0) return null;

  const currentProductionId = searchParams.get("productionId");
  const currentTheaterId = searchParams.get("stageId");

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  if (stageId) {
    nextSearchParams.delete("productionId");
    nextSearchParams.set("stageId", stageId.toString());
  } else {
    nextSearchParams.set("productionId", productionId.toString());
    nextSearchParams.delete("stageId");
  }
  nextSearchParams.set("lat", position.lat.toString());
  nextSearchParams.set("lng", position.lng.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const closeSearchParams = new URLSearchParams(searchParams.toString());
  closeSearchParams.delete("productionId");
  const closeUrl = createUrl(pathname, closeSearchParams);

  const active =
    groupedProductionIds?.includes(parseInt(currentProductionId || "")) ||
    currentProductionId === productionId.toString() ||
    currentTheaterId === stageId?.toString();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={() => {
          router.push(nextUrl);
          map?.setCenter(position);
        }}
      >
        {children}
      </AdvancedMarker>
      {active && (
        <InfoWindow
          anchor={marker}
          position={position}
          onCloseClick={() => {
            router.push(closeUrl);
          }}
          maxWidth={1280}
        >
          {productions.length === 1 && (
            <div className="w-full min-w-[400px] max-w-7xl">
              <div className="flex w-full justify-center">
                {productions[0].poster_url && (
                  <div className="relative mt-2 h-[200px] w-[150px]">
                    <Image
                      src={productions[0].poster_url}
                      alt={productions[0].name || "Production poster"}
                      fill
                      sizes="150px"
                    />
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-xl font-semibold">{productions[0].name}</h3>

                <div className="mt-2 text-sm">
                  <p>
                    Presented by {productions[0].theaters?.name} at{" "}
                    {productions[0].stages?.name}
                  </p>
                  <p>{productions[0].stages?.addresses?.street_address}</p>
                  <p>
                    {productions[0].stages?.addresses?.city},{" "}
                    {productions[0].stages?.addresses?.state}
                  </p>
                </div>
                <div className="mt-2">
                  <p>Cost: {productions[0].cost_range}</p>
                  <p>Duration: {productions[0].duration_minutes} mins.</p>
                </div>
                <div className="mt-2">
                  {productions[0].url && (
                    <Link
                      href={productions[0].url}
                      className="text-blue-600 underline"
                      target="_blank"
                    >
                      Click for more info
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          {productions.length >= 2 && (
            <div className="mx-auto max-h-[50vh] w-full p-4 lg:max-w-7xl">
              <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Productions at {productions[0].stages?.name}
              </h2>
              <div className="mt-4 flex justify-center gap-x-4">
                {productions.map((production) => (
                  <div
                    key={production.id}
                    className={cn(
                      "group relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white",
                      production.id === productionId &&
                        "ring-4 ring-fuchsia-600 ring-offset-2",
                    )}
                  >
                    <div className="flex justify-center group-hover:opacity-75">
                      {production.poster_url && (
                        <div className="relative h-[300px] w-[225px]">
                          <Image
                            src={production.poster_url}
                            alt={production.poster_url || "Production poster"}
                            fill
                            sizes="225px"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {production.url ? (
                          <Link href={production.url} target="_blank">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {production.name}
                          </Link>
                        ) : (
                          production.name
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {production.summary
                          ? production.summary.length > 200
                            ? production.summary.slice(0, 200) + "..."
                            : production.summary
                          : "No summary provided."}
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
          )}
        </InfoWindow>
      )}
    </>
  );
}
