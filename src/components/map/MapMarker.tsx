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
  theaterId?: number;
  groupedProductionIds?: number[];
}

export default function MapMarker({
  productionId,
  theaterId,
  groupedProductionIds,
  position,
  children,
}: MapMarkerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentProductionId = searchParams.get("productionId");
  const currentTheaterId = searchParams.get("theaterId");

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  if (theaterId) {
    nextSearchParams.delete("productionId");
    nextSearchParams.set("theaterId", theaterId.toString());
  } else {
    nextSearchParams.set("productionId", productionId.toString());
    nextSearchParams.delete("theaterId");
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
    currentTheaterId === theaterId?.toString();

  return (
    <Marker
      position={position}
      onClick={() => {
        router.push(nextUrl);
        map?.setCenter(position);
      }}
      // icon={{
      //   url: "/images/map-marker.svg",
      //   scaledSize: new google.maps.Size(40, 40),
      // }}
    >
      {active && (
        <InfoWindow
          position={position}
          onCloseClick={() => {
            router.push(closeUrl);
          }}
          options={{
            maxWidth: 1920,
          }}
        >
          {children}
        </InfoWindow>
      )}
    </Marker>
  );
}
