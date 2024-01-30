"use client";

// Search input component with Google Maps Places Autocomplete
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";

// Geographic boundary to bias the search results to Sacramento County.
// Results outside of this area will still be returned, but will be lower priority.
const SAC_COUNTY_BOUNDS = {
  west: -121.862622,
  south: 38.018421,
  east: -121.027084,
  north: 38.736405,
};

export default function AddressFinderInput() {
  const { isLoaded, loadError } = useLoadGoogleApi();
  const { setValue, getValues } = useFormContext();

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
      const addressComponents = place.address_components;
      if (addressComponents === undefined) {
        alert("Could not find any address components");
        return;
      }

      const get = (name: string) =>
        addressComponents.find((c) => c.types.includes(name));

      const streetNumber = get("street_number")?.long_name;
      const streetName = get("route")?.long_name;
      const city = get("locality")?.long_name;
      const state = get("administrative_area_level_1")?.short_name;
      const postalCode = get("postal_code")?.long_name;
      const streetAddress = streetName
        ? streetNumber
          ? `${streetNumber} ${streetName}`
          : streetName
        : null;

      if (streetAddress) setValue("street_address", streetAddress);
      if (city) setValue("city", city);
      if (state) setValue("state", state);
      if (postalCode) setValue("postal_code", parseInt(postalCode));
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
      <Input
        type="text"
        placeholder="Type here to search for an address."
        disabled
      />
    );

  return (
    <StandaloneSearchBox
      onLoad={handleLoad}
      onPlacesChanged={handlePlacesChanged}
      bounds={SAC_COUNTY_BOUNDS}
    >
      <Input
        type="text"
        placeholder="Type here to search for an address"
        onKeyDown={(e) => {
          if (e.code === "Enter") e.preventDefault();
        }}
      />
    </StandaloneSearchBox>
  );
}
