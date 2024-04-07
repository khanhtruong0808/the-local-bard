"use client";

import { GoogleMap } from "@react-google-maps/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { clientEnv } from "@/lib/clientEnv";
import { useLoadGoogleApi } from "@/lib/googleMaps";
import { createUrl } from "@/lib/utils";

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
    (e: google.maps.MapMouseEvent) => {
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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={zoom}
      onClick={handleMapClick}
      options={{
        backgroundColor: "black",
        gestureHandling: "greedy", // Allow zooming without holding ctrl
        mapId: clientEnv.NEXT_PUBLIC_GOOGLE_MAP_ID,
      }}
    >
      {children}
    </GoogleMap>
  );
}
