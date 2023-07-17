/**
 * Search input component with Google Maps Places Autocomplete
 */

"use client";
import { useLoadGoogleApi } from "@/lib/googleMaps";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Restrictions on the autocomplete search
const restrictions = {
  country: "us",
};

export default function SearchInput() {
  const router = useRouter();
  const { isLoaded, loadError } = useLoadGoogleApi();

  const [search, setSearch] = useState<google.maps.places.Autocomplete | null>(
    null
  );

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearch(autocomplete);
  };

  const handlePlaceChanged = () => {
    if (search) {
      const place = search.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (lat !== undefined && lng !== undefined) {
        router.push(
          "/search?" +
            new URLSearchParams({ lat: lat.toString(), lng: lng.toString() })
        );
      } else {
        // TODO: deal with error some better way
        alert("Error: could not get latitude and longitude from place");
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
        className="w-full p-4 pr-7 placeholder:text-gray-600 rounded-sm font-sans truncate"
      />
    );

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceChanged}
      restrictions={restrictions}
    >
      <input
        type="text"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
        className="w-full p-4 pr-7 placeholder:text-gray-600 rounded-sm font-sans truncate"
      />
    </Autocomplete>
  );
}
