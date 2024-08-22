"use client";

import {
  AdvancedMarker,
  AdvancedMarkerProps,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FullProductions } from "@/lib/supabase/queries";
import { cn, createUrl } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const currentStageId = searchParams.get("stageId");

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  if (stageId) {
    nextSearchParams.delete("productionId");
    nextSearchParams.set("stageId", stageId.toString());
    nextSearchParams.set("productionId", productionId.toString());
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
    currentStageId === stageId?.toString();

  const currentProduction = productions.find(
    (p) => p.id === parseInt(currentProductionId || ""),
  );

  const handleClick = () => {
    if (active) {
      router.push(closeUrl);
    } else {
      router.push(nextUrl);
      map?.setCenter(position);
    }
  };

  const currentProductionIndex = productions.findIndex(
    (p) => p.id === parseInt(currentProductionId || ""),
  );

  const prevProduction =
    currentProductionIndex === 0
      ? productions[productions.length - 1]
      : productions[currentProductionIndex - 1];
  const nextProduction =
    currentProductionIndex === productions.length - 1
      ? productions[0]
      : productions[currentProductionIndex + 1];
  const prevProductionSearchParams = new URLSearchParams(
    searchParams.toString(),
  );
  prevProductionSearchParams.set("productionId", prevProduction?.id.toString());

  const nextProductionSearchParams = new URLSearchParams(
    searchParams.toString(),
  );
  nextProductionSearchParams.set("productionId", nextProduction?.id.toString());

  const prevProductionUrl = createUrl(pathname, prevProductionSearchParams);
  const nextProductionUrl = createUrl(pathname, nextProductionSearchParams);

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
          onClick={() =>
            active &&
            currentProduction?.url &&
            window.open(currentProduction.url, "_blank")
          }
        >
          {children}
          <div className={cn(active ? "block" : "hidden")}>
            <div className="mt-2 flex flex-col items-center justify-center">
              <h2 className="text-center text-2xl font-bold text-zinc-900">
                {currentProduction?.name}
              </h2>
              <p className="font-serif text-xs">{currentProduction?.summary}</p>
              <p className="text-base">
                Showing from&nbsp;
                {new Date(
                  currentProduction?.start_date || 0,
                ).toLocaleDateString()}
                &nbsp;to&nbsp;
                {new Date(
                  currentProduction?.end_date || 0,
                ).toLocaleDateString()}
              </p>
              <p className="text-base">
                {currentProduction?.duration_minutes}
                &nbsp;minutes
              </p>
              <p className="text-base">{currentProduction?.cost_range}</p>
              <p className="text-sm">{currentProduction?.notes}</p>
              {productions.length > 1 && (
                <div className="flex">
                  <ArrowLeft
                    className={cn("h-10 w-10")}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(prevProductionUrl);
                    }}
                  />
                  <ArrowRight
                    className="h-10 w-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(nextProductionUrl);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </AdvancedMarker>
    </>
  );
}
