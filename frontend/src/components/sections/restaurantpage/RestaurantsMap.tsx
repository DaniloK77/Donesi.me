"use client";

import dynamic from "next/dynamic";
import type { CategoryTranslations } from "@/utils/categoryTranslations";

export interface MapRestaurantPin {
  slug: string;
  name: string;
  category: string;
  rating: number;
  latitude: number;
  longitude: number;
}

export interface RestaurantsMapProps {
  restaurants: MapRestaurantPin[];
  centerLat?: number;
  centerLng?: number;
  defaultZoom?: number;
  categoryTranslations: CategoryTranslations;
}

const RestaurantsMapCanvas = dynamic(
  () => import("./RestaurantsMapCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-label="Loading restaurant map"
        className="h-full w-full animate-pulse bg-[linear-gradient(135deg,#f3f4f6_25%,#e5e7eb_25%,#e5e7eb_50%,#f3f4f6_50%,#f3f4f6_75%,#e5e7eb_75%)] bg-size-[32px_32px]"
        role="status"
      />
    ),
  },
);

export default function RestaurantsMap(props: RestaurantsMapProps) {
  return <RestaurantsMapCanvas {...props} />;
}
