"use client";

import {
  APIProvider,
  Map as VisglMap,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { clientEnv } from "@/lib/clientEnv";
import { useLoadGoogleApi } from "@/lib/googleMaps";
import { createUrl } from "@/lib/utils";

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
        <LocationPanHandler />
        {children}
      </VisglMap>
    </APIProvider>
  );
}

/** Makes sure the map pans to wherever the lat/lng search params are */
function LocationPanHandler() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (lat && lng) {
      map.panTo({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng, map]);

  return null;
}
