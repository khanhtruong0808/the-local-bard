"use client";

import {
  APIProvider,
  Map as VisglMap,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { parseAsFloat, parseAsInteger, useQueryStates } from "nuqs";
import { useCallback, useEffect, useState } from "react";

import { clientEnv } from "@/lib/clientEnv";
import { defaultMapCenter, defaultMapZoom } from "@/lib/constants";
import { MapMarkers } from "./markers";

export function Map() {
  const [{ productionId, stageId }, setIds] = useQueryStates({
    productionId: parseAsInteger,
    stageId: parseAsInteger,
  });

  const [currentZoom, setCurrentZoom] = useState(defaultMapZoom);

  /** Close any open info windows when the map is clicked. */
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (productionId === null && stageId === null) return;
      setIds({ productionId: null, stageId: null });
    },
    [productionId, stageId, setIds],
  );

  return (
    <APIProvider apiKey={clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <VisglMap
        mapId={clientEnv.NEXT_PUBLIC_GOOGLE_MAP_ID}
        defaultCenter={defaultMapCenter}
        defaultZoom={currentZoom}
        onZoomChanged={(zoom) => setCurrentZoom(zoom.detail.zoom)}
        gestureHandling="greedy"
        onClick={handleMapClick}
      >
        <LocationPanHandler />
        <MapMarkers />
      </VisglMap>
    </APIProvider>
  );
}

/** Makes sure the map pans to wherever the lat/lng search params are */
function LocationPanHandler() {
  const [{ lat, lng }, _] = useQueryStates({
    lat: parseAsFloat,
    lng: parseAsFloat,
  });
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (lat && lng) {
      map.panTo({ lat, lng });
    }
  }, [lat, lng, map]);

  return null;
}
