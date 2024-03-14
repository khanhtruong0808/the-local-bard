"use client";

import { GoogleMap } from "@react-google-maps/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { clientEnv } from "@/lib/clientEnv";
import { useLoadGoogleApi } from "@/lib/googleMaps";
import { createUrl } from "@/lib/utils";
import {
  APIProvider,
  type MapMouseEvent,
  Map as VisglMap,
} from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Sacramento, CA
const defaultCenter = {
  lat: 38.576657,
  lng: -121.493652,
};

const zoom = 12;

export default function Map({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isLoaded, loadError } = useLoadGoogleApi();

  // Close any open info windows when the map is clicked.
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const currentProductionId = searchParams.get("productionId");
      const currentTheaterId = searchParams.get("stageId");
      if (currentProductionId === null && currentTheaterId === null) return;

      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("productionId");
      nextSearchParams.delete("stageId");
      const nextUrl = createUrl(pathname, nextSearchParams);
      router.push(nextUrl);
    },
    [pathname, router, searchParams],
  );

  if (loadError) {
    // TODO: replace with some error indicator
    throw new Error("Error loading Google Maps API");
  }

  if (!isLoaded) return null; // TODO: replace with some loading indicator

  return (
    <APIProvider apiKey={clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <VisglMap
        mapId={clientEnv.NEXT_PUBLIC_GOOGLE_MAP_ID}
        defaultCenter={defaultCenter}
        defaultZoom={zoom}
        gestureHandling="greedy"
        onClick={handleMapClick}
      >
        {children}
      </VisglMap>
    </APIProvider>
  );
}
