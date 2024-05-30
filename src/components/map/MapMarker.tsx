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
  closeSearchParams.delete("stageId");
  const closeUrl = createUrl(pathname, closeSearchParams);

  const active =
    groupedProductionIds?.includes(parseInt(currentProductionId || "")) ||
    currentProductionId === productionId.toString() ||
    currentTheaterId === stageId?.toString();

  const handleClick = () => {
    console.log("handling click");
    if (active) {
      console.log("active, changing url to", closeUrl);
      router.push(closeUrl);
    } else {
      console.log("not active");
      router.push(nextUrl);
      map?.setCenter(position);
    }
  };

  return (
    <>
      <AdvancedMarker
        zIndex={active ? 1 : 0}
        ref={markerRef}
        position={position}
        style={{ transition: "all 0.3s ease-out" }}
        onClick={handleClick}
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
            show={active}
            enter="transition-all duration-300"
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
    </>
  );
}
