import type { StyleSpecification } from "maplibre-gl";

export const PODGORICA_CENTER = {
  latitude: 42.44124,
  longitude: 19.26309,
} as const;

export const PODGORICA_MAP_BOUNDS: [
  [number, number],
  [number, number],
] = [
  [19.15, 42.38],
  [19.38, 42.51],
];

export const PODGORICA_MIN_ZOOM = 12;

export const PODGORICA_MAP_STYLE = {
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

export function isWithinPodgoricaMapBounds(
  latitude: number,
  longitude: number,
) {
  const [[west, south], [east, north]] = PODGORICA_MAP_BOUNDS;

  return (
    latitude >= south &&
    latitude <= north &&
    longitude >= west &&
    longitude <= east
  );
}
