"use client";

import { GoogleMap } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { nightModeStyles, useLoadGoogleApi } from "@/lib/googleMaps";
import { type FullProductions } from "@/lib/supabase/queries";

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
  const [activeProduction, setActiveProduction] = useState<
    FullProductions[number] | null
  >(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const searchParams = useSearchParams();
  const { isLoaded, loadError } = useLoadGoogleApi();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const handleActiveProduction = (production: FullProductions[number]) => {
    const lat = production.theaters?.addresses?.latitude;
    const lng = production.theaters?.addresses?.longitude;

    if (production === activeProduction) {
      setActiveProduction(null);
    } else {
      setActiveProduction(production);
    }

    if (map && lat != null && lng != null) {
      map.setCenter({ lat, lng });
    }
  };

  // If we have selected a production's marker, use that as the map center.
  // Otherwise, use the lat/lng from the URL search params.
  // Else, use the default center.
  let center = defaultCenter;

  const activeAddress = activeProduction?.theaters?.addresses;
  const activeLat = activeAddress?.latitude;
  const activeLng = activeAddress?.longitude;
  const [lat, lng] = [searchParams.get("lat"), searchParams.get("lng")];

  if (activeLat != null && activeLng != null) {
    center = {
      lat: activeLat,
      lng: activeLng,
    };
  } else if (lat !== null && lng !== null) {
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
      options={{
        backgroundColor: "black",
        styles: nightModeStyles,
      }}
    >
      {children}
    </GoogleMap>
  );
}
