"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LngLatBounds } from "maplibre-gl";
import { Bike, Car, Home, Navigation2, UtensilsCrossed } from "lucide-react";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import {
  PODGORICA_MAP_BOUNDS,
  PODGORICA_MAP_STYLE,
  PODGORICA_MIN_ZOOM,
} from "@/lib/podgorica-map";
import {
  sliceRouteCoordinates,
  toLngLat,
  type DeliveryRoute,
  type RoutePoint,
} from "@/lib/delivery-route";
import type { CourierVehicle } from "./courier";

const VEHICLE_ICONS = {
  SCOOTER: Bike,
  BICYCLE: Bike,
  CAR: Car,
} as const;

export type CourierTrackingMapLabels = {
  pickupMarker: string;
  dropoffMarker: string;
  courierMarker: string;
};

type CourierTrackingMapProps = {
  route: DeliveryRoute;
  pickup: RoutePoint;
  dropoff: RoutePoint;
  pickupName: string;
  dropoffName: string;
  courierName: string;
  courierPosition: RoutePoint;
  courierVehicle: CourierVehicle;
  headingDegrees: number;
  traveledMeters: number;
  hasArrived: boolean;
  labels: CourierTrackingMapLabels;
};

/**
 * Draws the route as an SVG overlay projected onto the map, rather than as a
 * MapLibre line layer.
 *
 * Line layers feed their GeoJSON through MapLibre's web worker, and that worker
 * never comes up under `next dev` (its module script is served as HTML), so a
 * layer-based route silently stays empty. Projecting the points ourselves keeps
 * the route on the main thread, where it renders in dev and production alike.
 */
function RouteOverlay({
  route,
  traveledMeters,
}: {
  route: DeliveryRoute;
  traveledMeters: number;
}) {
  const { map } = useMap();
  // Re-project whenever the viewport moves; the courier's own progress arrives
  // as a prop change, which re-renders this component anyway.
  const [, onViewportChange] = useState(0);

  useEffect(() => {
    if (!map) {
      return;
    }

    const scheduleReproject = () => onViewportChange((tick) => tick + 1);

    map.on("move", scheduleReproject);
    map.on("resize", scheduleReproject);

    return () => {
      map.off("move", scheduleReproject);
      map.off("resize", scheduleReproject);
    };
  }, [map]);

  if (!map) {
    return null;
  }

  const toPixels = (coordinates: [number, number][]) =>
    coordinates
      .map((coordinate) => {
        const { x, y } = map.project(coordinate);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const fullRoute = toPixels(route.points.map(toLngLat));
  const remainingRoute = toPixels(
    sliceRouteCoordinates(route, traveledMeters, route.totalMeters),
  );

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <polyline
        points={fullRoute}
        fill="none"
        stroke="#03081F"
        strokeOpacity={0.14}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={remainingRoute}
        fill="none"
        stroke="#FC8A06"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>,
    map.getCanvasContainer(),
  );
}

/** Frames the restaurant, the address and the route once the map is ready. */
function FitRouteBounds({ route }: { route: DeliveryRoute }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const bounds = route.points.reduce(
      (accumulator, point) => accumulator.extend(toLngLat(point)),
      new LngLatBounds(toLngLat(route.points[0]), toLngLat(route.points[0])),
    );

    map.fitBounds(bounds, {
      padding: { top: 64, bottom: 64, left: 56, right: 56 },
      maxZoom: 16,
      duration: 0,
    });
  }, [map, isLoaded, route]);

  return null;
}

export default function CourierTrackingMap({
  route,
  pickup,
  dropoff,
  pickupName,
  dropoffName,
  courierName,
  courierPosition,
  courierVehicle,
  headingDegrees,
  traveledMeters,
  hasArrived,
  labels,
}: CourierTrackingMapProps) {
  const VehicleIcon = VEHICLE_ICONS[courierVehicle];

  return (
    <Map
      center={toLngLat(pickup)}
      zoom={13}
      minZoom={PODGORICA_MIN_ZOOM}
      maxZoom={18}
      maxBounds={PODGORICA_MAP_BOUNDS}
      theme="light"
      styles={{
        light: PODGORICA_MAP_STYLE,
        dark: PODGORICA_MAP_STYLE,
      }}
      className="h-full w-full"
    >
      <FitRouteBounds route={route} />

      {/*
       * Order matters: the overlay portals into the canvas container before the
       * markers mount, so the route paints above the basemap and below A, B and
       * the courier.
       */}
      <RouteOverlay route={route} traveledMeters={traveledMeters} />

      <MapMarker
        longitude={pickup.longitude}
        latitude={pickup.latitude}
        ariaLabel={`${labels.pickupMarker}: ${pickupName}`}
      >
        <MarkerContent>
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full border-3 border-white bg-brand-ink text-white shadow-[0_8px_24px_rgba(3,8,31,0.28)]"
          >
            <UtensilsCrossed aria-hidden="true" className="size-4" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-ink shadow-[0_2px_6px_rgba(3,8,31,0.24)]"
          >
            A
          </span>
        </MarkerContent>
        <MarkerTooltip className="font-sans">{pickupName}</MarkerTooltip>
      </MapMarker>

      <MapMarker
        longitude={dropoff.longitude}
        latitude={dropoff.latitude}
        ariaLabel={`${labels.dropoffMarker}: ${dropoffName}`}
      >
        <MarkerContent>
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full border-3 border-white bg-brand-green text-white shadow-[0_8px_24px_rgba(3,8,31,0.28)]"
          >
            <Home aria-hidden="true" className="size-4" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-ink shadow-[0_2px_6px_rgba(3,8,31,0.24)]"
          >
            B
          </span>
        </MarkerContent>
        <MarkerTooltip className="font-sans">{dropoffName}</MarkerTooltip>
      </MapMarker>

      <MapMarker
        longitude={courierPosition.longitude}
        latitude={courierPosition.latitude}
        ariaLabel={`${labels.courierMarker}: ${courierName}`}
      >
        <MarkerContent>
          {!hasArrived ? (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand/35"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="relative flex size-11 items-center justify-center rounded-full border-3 border-brand bg-white text-brand shadow-[0_10px_28px_rgba(3,8,31,0.32)]"
          >
            <VehicleIcon aria-hidden="true" className="size-5" />
          </span>
          {!hasArrived ? (
            <span
              aria-hidden="true"
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-brand"
            >
              <Navigation2
                aria-hidden="true"
                className="size-3.5 fill-current"
                style={{ transform: `rotate(${headingDegrees}deg)` }}
              />
            </span>
          ) : null}
        </MarkerContent>
        <MarkerTooltip className="font-sans">{courierName}</MarkerTooltip>
      </MapMarker>

      <MapControls
        position="bottom-right"
        showZoom
        className="[&_button]:bg-white [&_button]:text-brand-ink [&_button:hover]:bg-brand [&_button:hover]:text-white"
      />
    </Map>
  );
}
