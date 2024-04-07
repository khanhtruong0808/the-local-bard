"use client";

import React from "react";

import { createUrl } from "@/lib/utils";
import {
  InfoWindow,
  Marker,
  useGoogleMap,
  type MarkerProps,
} from "@react-google-maps/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MapMarkerProps extends MarkerProps {
  productionId: number;
  stageId?: number;
  groupedProductionIds?: number[];
}

export default function MapMarker({
  productionId,
  stageId,
  groupedProductionIds,
  position,
  children,
}: MapMarkerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const map = useGoogleMap();

  const active =
    groupedProductionIds?.includes(parseInt(currentProductionId || "")) ||
    currentProductionId === productionId.toString() ||
    currentTheaterId === stageId?.toString();

  return (
    <Marker
      position={position}
      onClick={() => {
        router.push(nextUrl);
        map?.setCenter(position);
      }}
    >
      {active && (
        <InfoWindow
          position={position}
          onCloseClick={() => {
            router.push(closeUrl);
          }}
          options={{
            maxWidth: 1280,
          }}
        >
          {children}
        </InfoWindow>
      )}
    </Marker>
  );
}
