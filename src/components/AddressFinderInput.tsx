"use client";

// Search input component with Google Maps Places Autocomplete
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";

import { useLoadGoogleApi } from "@/lib/googleMaps";
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form";
import { cn } from "@/lib/utils";

// Geographic boundary to bias the search results to Sacramento County.
// Results outside of this area will still be returned, but will be lower priority.
const SAC_COUNTY_BOUNDS = {
  west: -121.862622,
  south: 38.018421,
  east: -121.027084,
  north: 38.736405,
};

export default function AddressFinderInput({
  description,
}: {
  description?: string;
}) {
  const { isLoaded, loadError } = useLoadGoogleApi();
  const { setValue, getValues, getFieldState } = useFormContext();

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
        alert(
          "Could not find any address components. Try a different address.",
        );
        return;
      }

      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (lat === undefined || lng === undefined) {
        alert("Could not find latitude or longitude");
        return;
      }

      const get = (name: string) =>
        addressComponents.find((c) => c.types.includes(name));

      const streetNumber = get("street_number")?.long_name;
      const streetName = get("route")?.long_name;
      const city = get("locality")?.long_name;
      const state = get("administrative_area_level_1")?.short_name;
      const postalCode = get("postal_code")?.long_name;
      if (!streetNumber || !streetName || !city || !state || !postalCode) {
        alert("Invalid address. Please try again.");
        return;
      }

      const streetAddress = `${streetNumber} ${streetName}`;

      setValue("street_address", streetAddress, { shouldDirty: true });
      setValue("city", city, { shouldDirty: true });
      setValue("state", state, { shouldDirty: true });
      setValue("postal_code", postalCode, { shouldDirty: true });
      setValue("latitude", lat, { shouldDirty: true });
      setValue("longitude", lng, { shouldDirty: true });
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
      <FormItem>
        <FormLabel>Address</FormLabel>
        <Input
          type="text"
          placeholder="Type here to search for an address."
          disabled
        />
        {description && <FormDescription>{description}</FormDescription>}
      </FormItem>
    );

  const currentValues = getValues();
  const currentStreetAddress = currentValues.street_address;
  const currentCity = currentValues.city;
  const currentState = currentValues.state;
  const currentAddress =
    currentStreetAddress && currentCity && currentState
      ? `${currentStreetAddress}, ${currentCity}, ${currentState}`
      : undefined;

  const currentError =
    getFieldState("street_address")?.error ||
    getFieldState("city")?.error ||
    getFieldState("state")?.error ||
    getFieldState("postal_code")?.error ||
    getFieldState("latitude")?.error ||
    getFieldState("longitude")?.error;

  return (
    <StandaloneSearchBox
      onLoad={handleLoad}
      onPlacesChanged={handlePlacesChanged}
      bounds={SAC_COUNTY_BOUNDS}
    >
      <FormItem>
        <FormLabel
          className={cn(currentError && "text-red-500 dark:text-red-600")}
        >
          Address
        </FormLabel>
        <Input
          type="text"
          placeholder="Type here to search for an address"
          defaultValue={currentAddress}
          onKeyDown={(e) => {
            if (e.code === "Enter") e.preventDefault();
          }}
        />
        {currentError && (
          <FormMessage className="text-red-500 dark:text-red-600">
            Invalid address. Try again.
          </FormMessage>
        )}
        {description && <FormDescription>{description}</FormDescription>}
      </FormItem>
    </StandaloneSearchBox>
  );
}
