"use client";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

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

export default function Map() {
  const searchParams = useSearchParams();

  const { isLoaded, loadError } = useLoadGoogleApi();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let center = defaultCenter;
  if (lat !== null && lng !== null) {
    center = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  }

  if (loadError) {
    // TODO: replace with some error indicator
    throw new Error("Error loading Google Maps API");
  }

  if (!isLoaded) return null; // TODO: replace with some loading indicator

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        position={center}
        onClick={() => {
          alert(
            "Marker clicked. TODO: open details about this, probably in a dialog or side drawer."
          );
        }}
      />
    </GoogleMap>
  );
}
