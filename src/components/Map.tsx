"use client";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { Tables } from "@/lib/supabase/dbHelperTypes";
import { supabase } from "@/lib/supabase/supabaseClient";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Sacramento, CA
const defaultCenter = {
  lat: 38.576657,
  lng: -121.493652,
};

const nightModeStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const zoom = 12;

type FullProductionInfo = Tables<"productions"> & {
  theaters:
    | (Tables<"theaters"> & {
        addresses: Tables<"addresses"> | null;
      })
    | null;
  stages: Tables<"stages"> | null;
};

export default function Map() {
  const [productions, setProductions] = useState<FullProductionInfo[]>([]);
  const [activeProduction, setActiveProduction] =
    useState<FullProductionInfo | null>(null);

  useEffect(() => {
    async function getProductions() {
      const { data, error } = await supabase
        .from("productions")
        .select(`*, theaters (*, addresses (*)), stages (*)`);

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

      if (!ignore) {
        setProductions(data);
      }
    }

    let ignore = false;
    getProductions();
    return () => {
      ignore = true;
    };
  }, []);

  const searchParams = useSearchParams();
  const { isLoaded, loadError } = useLoadGoogleApi();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const handleActiveProduction = (production: FullProductionInfo) => {
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

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

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
    <>
      <div className="flex flex-1">
        <div className="w-96 bg-zinc-800 px-4 py-6 text-zinc-200">
          {/* Left column area */}
          <h2 className="text-xl font-semibold leading-9 tracking-tight text-white">
            Productions
          </h2>
          <div className="mt-2 flex flex-col gap-y-4">
            {productions.map((production) => {
              const theater = production.theaters;
              const address = theater?.addresses;
              return (
                <div
                  key={production.id}
                  className="cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
                  onClick={() => handleActiveProduction(production)}
                >
                  <div className="sm:flex">
                    <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                      {production.poster_url && (
                        <Image
                          src={production.poster_url}
                          alt={production.name || "Production poster"}
                          width={100}
                          height={100}
                        />
                      )}
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-zinc-200">
                        {production.name}
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-zinc-400">
                        <p>{theater?.name}</p>
                        <p>{address?.street_address}</p>
                        <p>
                          {address?.city}, {address?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
        {productions.map((production) => {
          const lat = production?.theaters?.addresses?.latitude;
          const lng = production?.theaters?.addresses?.longitude;

          if (lat == null || lng == null) {
            return null;
          }

          return (
            <Marker
              key={production.id}
              position={{ lat, lng }}
              onClick={() => handleActiveProduction(production)}
            >
              {activeProduction === production && (
                <InfoWindow>
                  <div>
                    <h3 className="text-lg">{production.name}</h3>
                    <div className="mt-2 text-sm">
                      <p>Theater: {production.theaters?.name}</p>
                      <p>Stage: {production.stages?.name}</p>
                      <p>{production.theaters?.addresses?.street_address}</p>
                      <p>
                        {production.theaters?.addresses?.city},{" "}
                        {production.theaters?.addresses?.state}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p>Cost: {production.cost_range}</p>
                      <p>Duration: {production.duration_minutes} mins.</p>
                    </div>
                    <div className="mt-2">
                      {production.url && (
                        <Link
                          href={production.url}
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          Click for more info
                        </Link>
                      )}
                    </div>
                    {production.poster_url && (
                      <Image
                        className="mt-2"
                        src={production.poster_url}
                        alt={production.name || "Production poster"}
                        width={300}
                        height={300}
                      />
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </>
  );
}
