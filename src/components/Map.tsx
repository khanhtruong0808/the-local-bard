// This file is a huge mess. TODO:
// 1. Split sidebar into its own component.
// 2. Get filters to do something
// 3. Get map to be sticky instead of scrolling with the sidebar
//    (recreate Yelp functionality)
// 4. Figure out why clicking a production in the sidebar shows a tiny empty
//    InfoWindow above the marker as well as the full InfoWindow
"use client";

import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/dbHelperTypes";

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

interface MarkersProps {
  productions: FullProductionInfo[];
  activeProduction: FullProductionInfo | null;
  handleClick: (production: FullProductionInfo) => void;
}

const Markers = ({
  productions,
  activeProduction,
  handleClick,
}: MarkersProps) => {
  const uniqueAddressIds: number[] = [];

  productions.forEach((production) => {
    const address = production.theaters?.addresses;
    if (address != null && !uniqueAddressIds.includes(address.id)) {
      uniqueAddressIds.push(address.id);
    }
  });

  return uniqueAddressIds.map((addressId) => {
    const productionsAtAddress = productions.filter(
      (production) => production.theaters?.addresses?.id === addressId,
    );

    if (productionsAtAddress.length === 0) {
      return null;
    }

    if (productionsAtAddress.length === 1) {
      const production = productionsAtAddress[0];
      const lat = production?.theaters?.addresses?.latitude;
      const lng = production?.theaters?.addresses?.longitude;

      if (lat == null || lng == null) {
        return null;
      }

      return (
        <Marker
          key={production.id}
          position={{ lat, lng }}
          onClick={() => handleClick(production)}
        >
          {activeProduction !== null && activeProduction === production && (
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
    }

    // Else group productions together into one marker
    const lat = productionsAtAddress[0]?.theaters?.addresses?.latitude;
    const lng = productionsAtAddress[0]?.theaters?.addresses?.longitude;

    if (lat == null || lng == null) {
      return null;
    }

    return (
      <Marker
        key={productionsAtAddress[0].id}
        position={{ lat, lng }}
        onClick={() => handleClick(productionsAtAddress[0])}
      >
        {activeProduction !== null &&
          productionsAtAddress.includes(activeProduction) && (
            <InfoWindow>
              <div className="space-y-8 divide-y-2">
                {productionsAtAddress.map((production) => (
                  <div key={production.id}>
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
                ))}
              </div>
            </InfoWindow>
          )}
      </Marker>
    );
  });
};

export default function Map() {
  const [productions, setProductions] = useState<FullProductionInfo[]>([]);
  const [activeProduction, setActiveProduction] =
    useState<FullProductionInfo | null>(null);

  const supabase = createClient();

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
  }, [supabase]);

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
      {/* Sidebar */}
      <div className="flex flex-shrink-0 flex-grow-0 basis-2/5 overflow-y-auto bg-zinc-800">
        <div className="flex w-full flex-row px-10 py-6 text-zinc-200">
          {/* Column 1 */}
          <div className="sticky z-50 w-60 flex-shrink-0 pr-10">
            <h2 className="text-xl font-semibold leading-9 tracking-tight text-white">
              Filters
            </h2>
            <fieldset className="mt-4">
              <legend className="sr-only">Price</legend>
              <h4 className="text-md font-medium leading-6 text-white">
                Price
              </h4>
              <div className="mt-2 space-y-2">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="oneDollar"
                      name="oneDollar"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="oneDollar"
                      className="font-medium text-white"
                    >
                      $
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="twoDollar"
                      name="twoDollar"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="twoDollar"
                      className="font-medium text-white"
                    >
                      $$
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="threeDollar"
                      name="threeDollar"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="threeDollar"
                      className="font-medium text-white"
                    >
                      $$$
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="fourDollar"
                      name="fourDollar"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="fourDollar"
                      className="font-medium text-white"
                    >
                      $$$$
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <hr className="my-4 border-slate-500" />
            <fieldset className="mt-4">
              <legend className="sr-only">Duration</legend>
              <h4 className="text-md font-medium leading-6 text-white">Type</h4>
              <div className="mt-2 space-y-2">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="musical"
                      name="musical"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="musical" className="font-medium text-white">
                      Musical
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="comedy"
                      name="comedy"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="comedy" className="font-medium text-white">
                      Comedy
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="tragedy"
                      name="tragedy"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="tragedy" className="font-medium text-white">
                      Tragedy
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <hr className="my-4 border-slate-500" />
            <fieldset className="mt-4">
              <legend className="sr-only">Something else</legend>
              <h4 className="text-md font-medium leading-6 text-white">
                Something else
              </h4>
              <div className="mt-2 space-y-2">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="option1"
                      name="option1"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="option1" className="font-medium text-white">
                      option1
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="option2"
                      name="option2"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="option2" className="font-medium text-white">
                      option2
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="option3"
                      name="option3"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="option3" className="font-medium text-white">
                      option3
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          {/* Left column area */}

          <div className="block w-full">
            <div className="mt-2 flex w-full flex-col gap-y-4">
              {productions.map((production) => {
                const theater = production.theaters;
                const address = theater?.addresses;
                return (
                  <div
                    key={production.id}
                    className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
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
        <Markers
          productions={productions}
          activeProduction={activeProduction}
          handleClick={handleActiveProduction}
        />
      </GoogleMap>
    </>
  );
}
