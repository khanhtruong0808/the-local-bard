"use client";

// Search input component with Google Maps Places Autocomplete
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { cn } from "@/lib/utils";

// Geographic boundary to bias the search results to Sacramento County.
// Results outside of this area will still be returned, but will be lower priority.
const SAC_COUNTY_BOUNDS = {
  west: -121.862622,
  south: 38.018421,
  east: -121.027084,
  north: 38.736405,
};

export default function SearchInput() {
  const router = useRouter();
  const { isLoaded, loadError } = useLoadGoogleApi();

  const [search, setSearch] = useState<google.maps.places.SearchBox | null>(
    null,
  );

  const handleLoad = (search: google.maps.places.SearchBox) => {
    setSearch(search);
  };

  const handlePlacesChanged = () => {
    if (search) {
      const places = search.getPlaces();

      if (places === undefined || places.length === 0) {
        alert("Could not find any places matching that search");
        return;
      }

      const place = places[0];
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (lat !== undefined && lng !== undefined) {
        router.push(
          "/search?" +
            new URLSearchParams({ lat: lat.toString(), lng: lng.toString() }),
        );
      } else {
        // This error should not happen unless the Google Maps place has no
        // associated geometry. I'm not sure when that happens.
        throw new Error("Could not get latitude and longitude from place");
      }
    }
  };

  if (loadError) {
    // TODO: replace with some error indicator
    throw new Error("Error loading Google Maps API");
  }

  // Show a disabled input if the Google Maps libraries are still loading
  // Could add some logic so that the text input still works even if the
  // libraries are loading so there's no flash of a disabled input
  if (!isLoaded)
    return (
      <input
        type="text"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
        disabled
        className="w-full truncate rounded-xs p-4 pr-7 font-sans placeholder:text-gray-600"
      />
    );

  return (
    <StandaloneSearchBox
      onLoad={handleLoad}
      onPlacesChanged={handlePlacesChanged}
      bounds={SAC_COUNTY_BOUNDS}
    >
      <input
        type="text"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
        className={cn(
          "w-full truncate rounded-xs p-4 pr-7 font-sans placeholder:text-gray-600",
          "dark:border-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-offset-zinc-500 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-100", // custom dark mode
        )}
      />
    </StandaloneSearchBox>
  );
}
