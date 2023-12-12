"use client";

import { createUrl } from "@/lib/utils";
import {
  InfoWindow,
  Marker,
  useGoogleMap,
  type MarkerProps,
} from "@react-google-maps/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MapMarkerProps extends MarkerProps {
  productionId: number;
}

export default function MapMarker({
  productionId,
  position,
  children,
}: MapMarkerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentProductionId = searchParams.get("productionId");

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  nextSearchParams.set("productionId", productionId.toString());
  nextSearchParams.set("lat", position.lat.toString());
  nextSearchParams.set("lng", position.lng.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const closeSearchParams = new URLSearchParams(searchParams.toString());
  closeSearchParams.delete("productionId");
  const closeUrl = createUrl(pathname, closeSearchParams);

  const map = useGoogleMap();

  return (
    <Marker
      position={position}
      onClick={() => {
        router.push(nextUrl);
        map?.setCenter(position);
      }}
      // icon={{
      //   url: "/images/map-marker.svg",
      //   scaledSize: new google.maps.Size(40, 40),
      // }}
    >
      {currentProductionId === productionId.toString() && (
        <InfoWindow
          position={position}
          onCloseClick={() => {
            router.push(closeUrl);
          }}
        >
          {children}
        </InfoWindow>
      )}
    </Marker>
  );
}
