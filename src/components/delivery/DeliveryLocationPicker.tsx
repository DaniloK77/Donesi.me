"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { MapMouseEvent } from "maplibre-gl";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
} from "@/components/ui/map";
import {
  isWithinPodgoricaMapBounds,
  PODGORICA_CENTER,
  PODGORICA_MAP_BOUNDS,
  PODGORICA_MAP_STYLE,
  PODGORICA_MIN_ZOOM,
} from "@/lib/podgorica-map";

export type DeliveryCoordinates = {
  latitude: number;
  longitude: number;
};

type DeliveryLocationPickerProps = {
  initialCoordinates: DeliveryCoordinates | null;
  confirmLabel: string;
  cancelLabel: string;
  instructions: string;
  markerLabel: string;
  removeMarkerLabel: string;
  onCancel: () => void;
  onClear: () => void;
  onConfirm: (coordinates: DeliveryCoordinates) => void;
};

type MapClickSelectorProps = {
  onSelect: (coordinates: DeliveryCoordinates) => void;
};

function MapClickSelector({ onSelect }: MapClickSelectorProps) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const canvas = map.getCanvas();
    const previousCursor = canvas.style.cursor;
    const selectLocation = (event: MapMouseEvent) => {
      const nextCoordinates = {
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      };

      if (
        isWithinPodgoricaMapBounds(
          nextCoordinates.latitude,
          nextCoordinates.longitude,
        )
      ) {
        onSelect(nextCoordinates);
      }
    };

    canvas.style.cursor = "crosshair";
    map.on("click", selectLocation);

    return () => {
      map.off("click", selectLocation);
      canvas.style.cursor = previousCursor;
    };
  }, [map, onSelect]);

  return null;
}

export default function DeliveryLocationPicker({
  initialCoordinates,
  confirmLabel,
  cancelLabel,
  instructions,
  markerLabel,
  removeMarkerLabel,
  onCancel,
  onClear,
  onConfirm,
}: DeliveryLocationPickerProps) {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<DeliveryCoordinates | null>(initialCoordinates);
  const selectCoordinates = useCallback(
    (nextCoordinates: DeliveryCoordinates) => {
      setSelectedCoordinates(nextCoordinates);
    },
    [],
  );
  const mapCenter = initialCoordinates ?? PODGORICA_CENTER;
  const clearMarkerAndReturn = () => {
    setSelectedCoordinates(null);
    onClear();
  };

  return (
    <div className="absolute inset-0 z-30 overflow-hidden rounded-xl bg-white">
      <Map
        center={[mapCenter.longitude, mapCenter.latitude]}
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
        <MapClickSelector onSelect={selectCoordinates} />

        {selectedCoordinates ? (
          <MapMarker
            longitude={selectedCoordinates.longitude}
            latitude={selectedCoordinates.latitude}
            ariaLabel={markerLabel}
            draggable
            onDragEnd={(lngLat) => {
              const nextCoordinates = {
                latitude: lngLat.lat,
                longitude: lngLat.lng,
              };

              if (
                isWithinPodgoricaMapBounds(
                  nextCoordinates.latitude,
                  nextCoordinates.longitude,
                )
              ) {
                selectCoordinates(nextCoordinates);
              }
            }}
          >
            <MarkerContent>
              <span className="flex size-12 items-center justify-center rounded-full border-3 border-white bg-brand text-white shadow-[0_8px_24px_rgba(3,8,31,0.32)]">
                <MapPin
                  aria-hidden="true"
                  className="size-6 fill-current"
                />
              </span>
            </MarkerContent>
          </MapMarker>
        ) : null}

        <MapControls
          position="bottom-right"
          showZoom
          className="[&_button]:bg-white [&_button]:text-brand-ink [&_button:hover]:bg-brand [&_button:hover]:text-white"
        />
      </Map>

      <div className="pointer-events-none absolute left-1/2 top-6 z-20 w-[min(520px,calc(100%-3rem))] -translate-x-1/2 rounded-xl bg-white/95 px-5 py-3 text-center text-[14px] font-medium text-brand-ink shadow-lg backdrop-blur">
        {instructions}
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex w-[min(520px,calc(100%-3rem))] -translate-x-1/2 items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 flex-1 rounded-lg border border-black/15 text-[14px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand"
        >
          {cancelLabel}
        </button>
        {selectedCoordinates ? (
          <button
            type="button"
            onClick={clearMarkerAndReturn}
            className="h-12 flex-1 rounded-lg border border-brand text-[14px] font-semibold text-brand transition-colors hover:bg-brand/8"
          >
            {removeMarkerLabel}
          </button>
        ) : null}
        <button
          type="button"
          disabled={!selectedCoordinates}
          onClick={() => {
            if (selectedCoordinates) {
              onConfirm(selectedCoordinates);
            }
          }}
          className="h-12 flex-[1.35] rounded-lg bg-brand text-[14px] font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
