"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

import { defaultMapZoom, legibleZoom } from "@/lib/constants";
import { fullProductionsQueryOptions } from "@/lib/queryOptions";
import { createClient } from "@/lib/supabase/client";
import type { FullProduction, FullProductions } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/24/outline";

const getZoomScaleFactor = (currentZoom: number) => {
  // Exponential function: f(x) = a * e^(b * x) + c
  const a = 0.177; // exponential multiplier
  const b = 0.347; // exponential rate
  const c = 0; // base size factor
  const cap = 2; // cap the size at 2x (600 x 800)

  const zoomScaleFactor = Math.min(
    a * Math.exp(b * (currentZoom - defaultMapZoom)) + c,
    cap,
  );
  return zoomScaleFactor;
};

export function MapMarkers() {
  const [searchParams, _setSearchParams] = useQueryStates({
    q: parseAsString,
    productionId: parseAsInteger,
    stageId: parseAsInteger,
    cost_range: parseAsArrayOf(parseAsStringEnum(["$", "$$", "$$$", "$$$$"])),
    genres: parseAsArrayOf(parseAsString),
    kid_friendly: parseAsBoolean,
    searchDate: parseAsIsoDate,
  });

  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: productions, error } = useQuery(
    fullProductionsQueryOptions({
      supabase,
      q: searchParams.q,
      cost_range: searchParams.cost_range,
      genres: searchParams.genres,
      kid_friendly: searchParams.kid_friendly,
      searchDate: searchParams.searchDate,
    }),
    queryClient,
  );

  if (error) throw error;
  if (!productions || productions.length === 0) return null;

  const uniqueAddressIds = productions
    .map((production) => production.stages.addresses?.id) // get address IDs
    .filter((id): id is number => id !== undefined && id !== null) // filter out undefined and null
    .filter((id, index, self) => self.indexOf(id) === index); // remove duplicates

  // For each unique address ID, create a marker.
  // If there are multiple productions at the same address, group them together.
  const content = uniqueAddressIds.map((addressId) => {
    const productionsAtAddress = productions.filter(
      (production) => production.stages.addresses?.id === addressId,
    );

    if (productionsAtAddress.length === 0) {
      return null;
    }

    if (productionsAtAddress.length === 1) {
      const production = productionsAtAddress[0];
      const address = production.stages.addresses;

      if (address == null) {
        console.error("Address is null for production", production.id);
        return null;
      }

      const lat = address.latitude;
      const lng = address.longitude;

      if (lat == null || lng == null) {
        console.error(
          "Latitude or longitude is null for production",
          production.id,
        );
        return null;
      }

      const isSelected =
        searchParams.productionId === production.id ||
        searchParams.stageId === production.stage_id;

      return (
        <SingleProductionMarker
          key={production.id}
          isSelected={isSelected}
          production={production}
        />
      );
    }

    // Else group productions together into one marker
    const lat = productionsAtAddress[0]?.stages?.addresses?.latitude;
    const lng = productionsAtAddress[0]?.stages?.addresses?.longitude;

    if (lat == null || lng == null) {
      console.error(
        "Latitude or longitude is null for production",
        productionsAtAddress[0].id,
      );
      return null;
    }

    // Sort productions by id ascending
    const orderedProductionsAtAddress = productionsAtAddress.sort((a, b) => {
      return a.id - b.id;
    });

    // This marker is selected if either:
    // 1. The productionId search param matches one of the productions at this address
    // 2. The stageId search param matches the stage_id of one of the productions at this address
    const isSelected =
      productionsAtAddress.findIndex(
        (p) => p.id === searchParams.productionId,
      ) !== -1 ||
      productionsAtAddress.findIndex(
        (p) => p.stage_id === searchParams.stageId,
      ) !== -1;

    return (
      <MultiProductionMarker
        key={orderedProductionsAtAddress[0].id}
        isSelected={isSelected}
        productionsAtMarkerAddress={orderedProductionsAtAddress}
        position={{ lat, lng }}
      />
    );
  });

  return <>{content}</>;
}

function SingleProductionMarker({
  isSelected,
  production,
}: {
  isSelected: boolean;
  production: FullProduction;
}) {
  const [markerRef] = useAdvancedMarkerRef();
  const map = useMap();

  const [_latLng, setLatLng] = useQueryStates({
    lat: parseAsFloat,
    lng: parseAsFloat,
  });

  const [_searchParamIds, setSearchParamIds] = useQueryStates({
    productionId: parseAsInteger,
    stageId: parseAsInteger,
  });

  const productionLat = production.stages.addresses?.latitude;
  const productionLng = production.stages.addresses?.longitude;
  if (productionLat == null || productionLng == null) {
    console.error(
      "Latitude or longitude is null for production",
      production.id,
    );
    return null;
  }

  const handleClick = () => {
    setSearchParamIds({
      productionId: production.id,
      stageId: production.stage_id,
    });
    setLatLng({ lat: productionLat, lng: productionLng });
    // zoom in enough such that the poster and info window are legible
    if (currentZoom < legibleZoom) {
      map?.setZoom(legibleZoom);
    }
    map?.setCenter({ lat: productionLat, lng: productionLng });
  };

  if (!map) return null;
  const currentZoom = map.getZoom() || defaultMapZoom;

  const zoomScaleFactor = getZoomScaleFactor(currentZoom);

  return (
    <AdvancedMarker
      zIndex={isSelected ? 1 : 0}
      ref={markerRef}
      position={{ lat: productionLat, lng: productionLng }}
      onClick={handleClick}
    >
      {/* <InfoWindow /> */}
      <AnimatePresence>
        <motion.div
          className={cn(
            "@container/main",
            "relative flex items-center justify-center rounded-sm",
            isSelected &&
              "bg-linear-to-r from-yellow-500 to-yellow-300 shadow-lg",
          )}
          onClick={() =>
            isSelected &&
            production?.url &&
            window.open(production.url, "_blank")
          }
          animate={{
            width:
              isSelected && currentZoom >= legibleZoom
                ? 1000 * zoomScaleFactor
                : 0,
            height:
              isSelected && currentZoom >= legibleZoom
                ? 500 * zoomScaleFactor
                : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className={cn("grid w-full grid-cols-12 gap-x-4 gap-y-8 px-4")}>
            {production?.poster_url ? (
              <div
                className={cn(
                  "relative aspect-3/4 w-full object-fill",
                  currentZoom < legibleZoom ? "col-span-full" : "col-span-5",
                )}
                style={{
                  width: 300 * zoomScaleFactor,
                  height: 400 * zoomScaleFactor,
                }}
              >
                <Image
                  src={production.poster_url}
                  alt={production.name}
                  fill={true}
                />
              </div>
            ) : (
              // Empty poster placeholder
              <div className="col-span-5 flex aspect-3/4 w-full items-center justify-center bg-gray-200/50">
                <PhotoIcon className="h-10 w-10 text-gray-200/50" />
              </div>
            )}
            <div
              className={cn(
                "@container mt-2 space-y-1",
                isSelected && currentZoom >= legibleZoom
                  ? "static col-span-7"
                  : "hidden",
              )}
            >
              <h2
                className={cn(
                  "min-w-0 overflow-hidden font-bold text-zinc-900",
                  "@5xs:text-lg @2xs:text-2xl @xs:text-3xl", // container query style based on size of info window
                )}
              >
                {production.name}
              </h2>
              <p
                className={cn(
                  "font-serif text-xs text-zinc-800/90",
                  "@5xs:text-xs @2xs:text-sm",
                )}
              >
                {production.summary && production.summary?.length > 300
                  ? production.summary.slice(0, 300) + "..."
                  : production.summary}
              </p>
              <p
                className={cn(
                  "w-full truncate text-wrap text-zinc-800/90",
                  "@5xs:text-xs @2xs:text-sm @xs:text-base", // container query style based on size of info window
                )}
              >
                Showing from&nbsp;
                {new Date(production.start_date || 0).toLocaleDateString()}
                &nbsp;to&nbsp;
                {new Date(production.end_date || 0).toLocaleDateString()}
              </p>
              <p className="@5xs:text-xs text-zinc-800/90 @2xs:text-sm @xs:text-base">
                {production.duration_minutes}
                &nbsp;minutes
              </p>
              <p className="@5xs:text-xs text-zinc-800/90 @2xs:text-sm @xs:text-base">
                {production.cost_range}
              </p>
              <p className="@5xs:text-2xs text-zinc-800/90 @2xs:text-sm @xs:text-base">
                {production.notes}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </AdvancedMarker>
  );
}

/** Marker for multiple productions at the same address. */
function MultiProductionMarker({
  isSelected,
  productionsAtMarkerAddress,
  position,
}: {
  isSelected: boolean;
  productionsAtMarkerAddress: FullProductions;
  position: { lat: number; lng: number };
}) {
  const [markerRef] = useAdvancedMarkerRef();
  const map = useMap();

  const [_latLng, setLatLng] = useQueryStates({
    lat: parseAsFloat,
    lng: parseAsFloat,
  });

  const [searchParamIds, setSearchParamIds] = useQueryStates({
    productionId: parseAsInteger,
    stageId: parseAsInteger,
  });

  if (productionsAtMarkerAddress.length === 0) {
    console.error("No productions at marker address:", position);
    return null;
  }

  /** A longer name for this variable would be productionSelectedAtThisMarkerAddress.
   *  If there is a production selected at a different marker (i.e., the search param productionId is set to a different production),
   *  then this variable will be undefined.
   */
  const selectedProduction = productionsAtMarkerAddress.find(
    (p) => p.id === searchParamIds.productionId,
  );

  if (isSelected && selectedProduction === undefined) {
    console.error(
      "Selected production not found:",
      searchParamIds.productionId,
    );
    return null;
  }

  const handleClick = () => {
    if (selectedProduction) {
      // There is already a production selected at this marker, so we don't need to do anything.
      return;
    }

    // There was no previous production selected at this marker, so we need to select the first production at this marker.
    setSearchParamIds({
      productionId: productionsAtMarkerAddress[0].id,
      stageId: productionsAtMarkerAddress[0].stage_id,
    });
    setLatLng({ lat: position.lat, lng: position.lng });
  };

  const handlePrevProductionClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentProductionIndex = productionsAtMarkerAddress.findIndex(
      (p) => p.id === searchParamIds.productionId,
    );

    const prevProduction =
      currentProductionIndex === 0
        ? productionsAtMarkerAddress[productionsAtMarkerAddress.length - 1]
        : productionsAtMarkerAddress[currentProductionIndex - 1];

    setSearchParamIds({
      productionId: prevProduction.id,
    });
  };

  const handleNextProductionClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentProductionIndex = productionsAtMarkerAddress.findIndex(
      (p) => p.id === searchParamIds.productionId,
    );

    const nextProduction =
      currentProductionIndex === productionsAtMarkerAddress.length - 1
        ? productionsAtMarkerAddress[0]
        : productionsAtMarkerAddress[currentProductionIndex + 1];

    setSearchParamIds({
      productionId: nextProduction.id,
    });
  };

  if (!map) return null;
  const currentZoom = map.getZoom() || defaultMapZoom;

  const zoomScaleFactor = getZoomScaleFactor(currentZoom);

  return (
    <AdvancedMarker
      zIndex={isSelected ? 1 : 0}
      ref={markerRef}
      position={position}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-sm px-4 py-2",
          isSelected &&
            "bg-linear-to-r from-yellow-500 to-yellow-300 shadow-lg",
        )}
        style={{
          minWidth: !isSelected ? "fit-content" : 400,
          width: !isSelected ? 0 : Math.floor(500 * zoomScaleFactor),
        }}
        onClick={() =>
          isSelected &&
          selectedProduction?.url &&
          window.open(selectedProduction.url, "_blank")
        }
      >
        <div className="flex w-full items-center justify-between overflow-x-auto">
          {isSelected && (
            <ArrowLeft
              className={cn("h-10 w-10 transition-colors hover:text-zinc-700")}
              onClick={handlePrevProductionClick}
            />
          )}
          {/* TODO: make this less hacky... Ideally make it actually proportional to the zoom level */}
          <div
            className={cn(
              "flex flex-row",
              currentZoom <= 10
                ? ""
                : currentZoom <= 12
                  ? "-space-x-4"
                  : currentZoom <= 14
                    ? "-space-x-16"
                    : currentZoom <= 16
                      ? "-space-x-20"
                      : "-space-x-[20rem]",
            )}
          >
            {productionsAtMarkerAddress
              .sort((a, b) => a.id - b.id)
              .map((production, i) => {
                if (!production.poster_url) return null;
                return (
                  <motion.div
                    className="bg-opacity-75 relative aspect-3/4 w-full border bg-yellow-400 object-fill shadow-lg"
                    animate={{
                      opacity:
                        selectedProduction === undefined ||
                        production.id === selectedProduction.id
                          ? 1
                          : 0.5,
                    }}
                    key={i}
                    style={{
                      width: 300 * zoomScaleFactor,
                      height: 400 * zoomScaleFactor,
                      zIndex: production.id === selectedProduction?.id ? 50 : i,
                    }}
                  >
                    <Image
                      src={production.poster_url}
                      alt={production.name}
                      fill={true}
                    />
                  </motion.div>
                );
              })}
          </div>
          {isSelected && (
            <ArrowRight
              className="h-10 w-10 transition-colors hover:text-zinc-700"
              onClick={handleNextProductionClick}
            />
          )}
        </div>
        {selectedProduction && isSelected && (
          <div className="mt-2 flex flex-col items-center justify-center">
            <h2 className="text-center text-2xl font-bold text-zinc-900">
              {selectedProduction.name}
            </h2>
            <p className="font-serif text-xs">{selectedProduction.summary}</p>
            <p className="text-base">
              Showing from&nbsp;
              {new Date(
                selectedProduction.start_date || 0,
              ).toLocaleDateString()}
              &nbsp;to&nbsp;
              {new Date(selectedProduction.end_date || 0).toLocaleDateString()}
            </p>
            <p className="text-base">
              {selectedProduction.duration_minutes}
              &nbsp;minutes
            </p>
            <p className="text-base">{selectedProduction.cost_range}</p>
            <p className="text-sm">{selectedProduction.notes}</p>
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}
