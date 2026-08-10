"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapPinOff, Pause, Phone, Play, RotateCcw, Star, Timer } from "lucide-react";

import type { Lang } from "@/utils/getDictionary";
import type { TrackOrderDictionary } from "@/utils/getTrackOrderDictionary";
import { buildDeliveryRoute, type RoutePoint } from "@/lib/delivery-route";
import { resolveOrderCourier } from "./courier";
import { useCourierSimulation } from "./useCourierSimulation";
import type { Order, OrderCourier } from "./types";

/**
 * Step 4 of the tracking flow: the live map of the courier travelling from the
 * restaurant to the delivery address, with an ETA that updates as they get
 * closer. Movement is simulated on the client — see `useCourierSimulation`.
 */

/** Average city courier speed, used for the ETA (~23 km/h). */
const COURIER_SPEED_MPS = 6.5;
const PLAYBACK_SPEEDS = [1, 6, 12] as const;
const DEFAULT_PLAYBACK_SPEED = 6;

const CourierTrackingMap = dynamic(() => import("./CourierTrackingMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse bg-[linear-gradient(135deg,#f3f4f6_25%,#e5e7eb_25%,#e5e7eb_50%,#f3f4f6_50%,#f3f4f6_75%,#e5e7eb_75%)] bg-size-[32px_32px]"
    />
  ),
});

type DeliveryContent = TrackOrderDictionary["delivery"];

function useLocale(lang: Lang) {
  return lang === "me" ? "sr-Latn-ME" : "en-IE";
}

function MapUnavailable({ message }: { message: string }) {
  return (
    <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-brand-ink/8 bg-brand-surface p-4">
      <MapPinOff aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-ink/45" />
      <p className="text-[13px] leading-5 text-brand-ink/60">{message}</p>
    </div>
  );
}

function DeliveryTrackingMapSection({
  orderId,
  assignedCourier,
  pickupLatitude,
  pickupLongitude,
  pickupName,
  dropoffLatitude,
  dropoffLongitude,
  dropoffName,
  lang,
  content,
}: {
  orderId: string;
  assignedCourier: OrderCourier | null;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupName: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  dropoffName: string;
  lang: Lang;
  content: DeliveryContent;
}) {
  const locale = useLocale(lang);
  const [isRunning, setIsRunning] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(
    DEFAULT_PLAYBACK_SPEED,
  );
  const [runId, setRunId] = useState(0);

  // Kept as primitives up to here so the route (and the animation frame loop
  // that depends on it) is rebuilt only when the coordinates really change.
  const pickup = useMemo<RoutePoint>(
    () => ({ latitude: pickupLatitude, longitude: pickupLongitude }),
    [pickupLatitude, pickupLongitude],
  );
  const dropoff = useMemo<RoutePoint>(
    () => ({ latitude: dropoffLatitude, longitude: dropoffLongitude }),
    [dropoffLatitude, dropoffLongitude],
  );
  const route = useMemo(
    () => buildDeliveryRoute(pickup, dropoff, orderId),
    [pickup, dropoff, orderId],
  );
  const courier = useMemo(
    () => resolveOrderCourier(orderId, assignedCourier),
    [orderId, assignedCourier],
  );

  const simulation = useCourierSimulation({
    route,
    speedMetersPerSecond: COURIER_SPEED_MPS,
    timeScale: playbackSpeed,
    isRunning,
    runId,
  });

  const distanceFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });
  const formatDistance = (meters: number) =>
    meters >= 1000
      ? `${distanceFormatter.format(meters / 1000)} km`
      : `${Math.round(meters)} m`;

  const { hasArrived, telemetry } = simulation;
  const progressPercent = Math.round(simulation.progress * 100);

  const replayDelivery = () => {
    setRunId((previous) => previous + 1);
    setIsRunning(true);
  };

  return (
    <section
      aria-label={content.title}
      className="mt-6 overflow-hidden rounded-2xl border border-brand-ink/8 bg-brand-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-brand-ink">
            {content.title}
          </h3>
          <span className="rounded-full bg-brand-ink/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-ink/55">
            {content.demoBadge}
          </span>
        </div>

        <div
          aria-live="polite"
          className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[0_4px_16px_rgba(3,8,31,0.06)]"
        >
          <Timer aria-hidden="true" className="size-4 text-brand" />
          <span className="text-[12px] font-medium text-brand-ink/60">
            {hasArrived ? content.arrivedTitle : content.etaLabel}
          </span>
          {!hasArrived ? (
            <strong className="text-[14px] font-bold text-brand-ink">
              {telemetry.etaMinutes} {content.minutesShort}
            </strong>
          ) : null}
        </div>
      </div>

      <div className="px-5 pt-4">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label={content.progressLabel}
          className="h-1.5 w-full overflow-hidden rounded-full bg-brand-ink/10"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px] text-brand-ink/55">
          <span className="truncate">
            <span className="font-semibold text-brand-ink/75">A</span>{" "}
            {pickupName}
          </span>
          <span className="truncate text-right">
            {dropoffName}{" "}
            <span className="font-semibold text-brand-ink/75">B</span>
          </span>
        </div>
      </div>

      <div className="mt-4 h-72 w-full sm:h-96">
        <CourierTrackingMap
          route={route}
          pickup={pickup}
          dropoff={dropoff}
          pickupName={pickupName}
          dropoffName={dropoffName}
          courierName={courier.name}
          courierPosition={simulation.position}
          courierVehicle={courier.vehicle}
          headingDegrees={simulation.headingDegrees}
          traveledMeters={simulation.traveledMeters}
          hasArrived={hasArrived}
          labels={{
            pickupMarker: content.markers.pickup,
            dropoffMarker: content.markers.dropoff,
            courierMarker: content.markers.courier,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-brand-ink/8 bg-white px-5 py-4">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/12 text-[13px] font-bold text-brand"
        >
          {courier.initials}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
            {content.courierTitle}
          </p>
          <p className="truncate text-[14px] font-semibold text-brand-ink">
            {courier.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-brand-ink/55">
            <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
            {courier.rating.toFixed(1)}
            <span aria-hidden="true">·</span>
            {content.vehicleLabels[courier.vehicle]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            aria-live="polite"
            className="rounded-full bg-brand-surface px-3 py-2 text-[12px] font-medium text-brand-ink/65"
          >
            {hasArrived
              ? content.arrivedNote
              : `${content.remainingLabel}: ${formatDistance(telemetry.remainingMeters)}`}
          </span>
          <a
            href={`tel:${courier.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Phone aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">{courier.phone}</span>
            <span className="sm:hidden">{content.callLabel}</span>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-ink/8 bg-white px-5 py-3">
        <p className="text-[11px] leading-4 text-brand-ink/45">
          {content.simulationNote}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning((previous) => !previous)}
            disabled={hasArrived}
            className="flex items-center gap-1.5 rounded-full border border-brand-ink/12 px-3 py-1.5 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isRunning ? (
              <Pause aria-hidden="true" className="size-3.5" />
            ) : (
              <Play aria-hidden="true" className="size-3.5" />
            )}
            {isRunning ? content.pauseLabel : content.resumeLabel}
          </button>

          <button
            type="button"
            onClick={replayDelivery}
            className="flex items-center gap-1.5 rounded-full border border-brand-ink/12 px-3 py-1.5 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            {content.replayLabel}
          </button>

          <div
            role="group"
            aria-label={content.speedLabel}
            className="flex items-center overflow-hidden rounded-full border border-brand-ink/12"
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <button
                key={speed}
                type="button"
                aria-pressed={playbackSpeed === speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  playbackSpeed === speed
                    ? "bg-brand text-white"
                    : "text-brand-ink/60 hover:text-brand"
                }`}
              >
                {speed}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrderDeliveryTracking({
  order,
  lang,
  content,
}: {
  order: Order;
  lang: Lang;
  content: DeliveryContent;
}) {
  const restaurant = order.restaurant;
  const address = order.address;
  const pickupLatitude = restaurant?.latitude ?? null;
  const pickupLongitude = restaurant?.longitude ?? null;
  const dropoffLatitude = address?.latitude ?? null;
  const dropoffLongitude = address?.longitude ?? null;

  if (
    pickupLatitude === null ||
    pickupLongitude === null ||
    dropoffLatitude === null ||
    dropoffLongitude === null
  ) {
    return <MapUnavailable message={content.mapUnavailable} />;
  }

  const dropoffName =
    [address?.street, address?.city].filter(Boolean).join(", ") ||
    content.markers.dropoff;

  return (
    <DeliveryTrackingMapSection
      orderId={order.id}
      assignedCourier={order.courier}
      pickupLatitude={pickupLatitude}
      pickupLongitude={pickupLongitude}
      pickupName={
        restaurant?.name ??
        order.items[0]?.restaurantName ??
        content.markers.pickup
      }
      dropoffLatitude={dropoffLatitude}
      dropoffLongitude={dropoffLongitude}
      dropoffName={dropoffName}
      lang={lang}
      content={content}
    />
  );
}
