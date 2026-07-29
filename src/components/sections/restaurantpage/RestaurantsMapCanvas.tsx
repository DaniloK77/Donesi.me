"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import type { StyleSpecification } from "maplibre-gl";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import type { RestaurantsMapProps } from "./RestaurantsMap";

const podgoricaMapStyle = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        "&copy; OpenStreetMap contributors &copy; CARTO",
    },
  },
  layers: [
    {
      id: "carto-light",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
} satisfies StyleSpecification;

const podgoricaBounds: [[number, number], [number, number]] = [
  [19.15, 42.38], // Southwest
  [19.38, 42.51], // Northeast
];

const mapCopy = {
  en: {
    markerLabel: "Open details for",
    ratingLabel: "Rating",
    linkLabel: "View restaurant",
  },
  me: {
    markerLabel: "Otvori detalje za",
    ratingLabel: "Ocjena",
    linkLabel: "Pogledaj restoran",
  },
} as const;

export default function RestaurantsMapCanvas({
  restaurants,
  centerLat = 42.44124,
  centerLng = 19.26309,
  defaultZoom = 13,
}: RestaurantsMapProps) {
  const params = useParams<{ lang: string }>();
  const lang = params.lang === "me" ? "me" : "en";
  const copy = mapCopy[lang];

  return (
    <Map
      center={[centerLng, centerLat]}
      zoom={defaultZoom}
      minZoom={12}
      maxBounds={podgoricaBounds}
      theme="light"
      styles={{
        light: podgoricaMapStyle,
        dark: podgoricaMapStyle,
      }}
      className="h-full w-full"
    >
      {restaurants.map((restaurant) => (
        <MapMarker
          key={restaurant.slug}
          longitude={restaurant.longitude}
          latitude={restaurant.latitude}
          ariaLabel={`${copy.markerLabel} ${restaurant.name}`}
        >
          <MarkerContent>
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-full border-3 border-white bg-brand text-white shadow-[0_8px_24px_rgba(3,8,31,0.28)] transition-transform hover:scale-110 group-focus-visible:outline-3 group-focus-visible:outline-offset-3 group-focus-visible:outline-brand-ink"
            >
              <MapPin
                aria-hidden="true"
                className="size-5 fill-current"
              />
            </span>
          </MarkerContent>

          <MarkerTooltip className="font-sans">
            {restaurant.name}
          </MarkerTooltip>

          <MarkerPopup
            closeButton
            className="w-70 overflow-hidden rounded-xl border border-black/10 bg-white p-0 font-sans text-brand-ink shadow-xl"
          >
            <div className="border-b border-black/8 bg-brand-surface px-4 py-3 pr-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                {restaurant.category}
              </p>
              <h3 className="mt-1 text-[17px] font-bold leading-tight">
                {restaurant.name}
              </h3>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-[13px]">
                <Star
                  aria-hidden="true"
                  className="size-4 fill-amber-400 text-amber-400"
                />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-brand-ink/55">
                  {copy.ratingLabel}
                </span>
              </div>

              <Link
                href={`/${lang}/restaurants/${restaurant.slug}`}
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {copy.linkLabel}
              </Link>
            </div>
          </MarkerPopup>
        </MapMarker>
      ))}

      <MapControls
        position="top-right"
        showZoom
        className="[&_button]:size-10 [&_button]:bg-white [&_button]:text-brand-ink [&_button:hover]:bg-brand [&_button:hover]:text-white"
      />
    </Map>
  );
}
