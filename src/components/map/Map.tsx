// This file is a huge mess. TODO:
// 1. Get filters to do something
// 3. Figure out why clicking a production in the sidebar shows a tiny empty
//    InfoWindow above the marker as well as the full InfoWindow
"use client";

import { GoogleMap } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { nightModeStyles, useLoadGoogleApi } from "@/lib/googleMaps";
import { type FullProductions } from "@/lib/supabase/queries";
import MapFilters from "./MapFilters";
import MapMarkers from "./MapMarkers";
import MapProductionsList from "./MapProductionsList";

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

interface MapProps {
  productions: FullProductions;
}

export default function Map({ productions }: MapProps) {
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
    <div className="mx-auto flex h-full w-full items-start gap-x-4">
      {/* Sidebar Filters */}
      <div className="sticky top-20 hidden w-60 shrink-0 px-8 lg:block">
        <div className="mt-8 h-full w-full">
          <h2 className="text-xl font-semibold leading-9 tracking-tight text-white">
            Filters
          </h2>
          <MapFilters />
        </div>
      </div>

      {/* Sidebar Productions List */}
      <div className="relative z-10 w-96 shrink-0 px-4 py-4">
        <MapProductionsList
          productions={productions}
          handleActiveProduction={handleActiveProduction}
        />
      </div>
      <div className="sticky right-0 top-20 z-0 hidden h-[calc(100vh-5rem)] w-full xl:block">
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
          <MapMarkers
            productions={productions}
            activeProduction={activeProduction}
            handleClick={handleActiveProduction}
          />
        </GoogleMap>
      </div>
    </div>
  );
}
