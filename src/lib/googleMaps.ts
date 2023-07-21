"use client";

import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { clientEnv } from "./clientEnv";

// Array of libraries to load from Google Maps API
const libraries: Libraries = ["places"];

export const useLoadGoogleApi = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: clientEnv.NEXT_PUBLIC_GCP_PROJECT_ID,
    googleMapsApiKey: clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  return { isLoaded, loadError };
};
