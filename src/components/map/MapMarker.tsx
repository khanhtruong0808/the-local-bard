"use client";

import { Transition } from "@headlessui/react";
import {
  AdvancedMarker,
  AdvancedMarkerProps,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FullProductions } from "@/lib/supabase/queries";
import { cn, createUrl } from "@/lib/utils";

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
          if (active) {
            router.push(closeUrl);
          } else {
            router.push(nextUrl);
            map?.setCenter(position);
          }
        }}
      >
        <div
          className={cn(
            "flex max-w-lg flex-col items-center justify-center rounded px-4 py-2",
            active &&
              "bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-lg",
          )}
        >
          {children}
          <Transition
            as="div"
            className="z-30"
            show={active}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="mt-2 flex flex-col items-center justify-center">
              <h2 className="text-center text-2xl font-bold text-zinc-900">
                {productions[0].name}
              </h2>
              <p className="font-serif text-xs">{productions[0].summary}</p>
              <p className="text-base">
                Showing from&nbsp;
                {new Date(productions[0].start_date).toLocaleDateString()}
                &nbsp;to&nbsp;
                {new Date(productions[0].end_date).toLocaleDateString()}
              </p>
              <p className="text-base">
                {productions[0].duration_minutes}
                &nbsp;minutes
              </p>
              <p className="text-base">{productions[0].cost_range}</p>
              <p className="text-sm">{productions[0].notes}</p>
            </div>
          </Transition>
        </div>
      </AdvancedMarker>
      {/* {active && (
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
                  <Image
                    className="mt-2 h-[200px] w-[150px]"
                    src={productions[0].poster_url}
                    alt={productions[0].name || "Production poster"}
                    width={200}
                    height={150}
                  />
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
          {productions.length === 2 && (
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
          )}
        </InfoWindow>
      )} */}
    </>
  );
}
