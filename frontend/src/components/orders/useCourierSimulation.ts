"use client";

import { useEffect, useRef, useState } from "react";

import {
  positionAtDistance,
  type DeliveryRoute,
  type RoutePoint,
} from "@/lib/delivery-route";

/**
 * Drives the courier marker along a route.
 *
 * The demo has no live GPS feed, so movement is simulated on the client. The
 * marker position is refreshed on every animation frame (a smooth glide), while
 * the ETA readout is refreshed on a slower "GPS ping" interval so the text does
 * not flicker.
 *
 * `timeScale` compresses the trip for demo purposes: distance covered per real
 * second is `speedMetersPerSecond * timeScale`, but the ETA is derived from the
 * real-world speed, so it stays a plausible number that simply counts down
 * faster than wall clock.
 */

const GPS_PING_MS = 2000;
/**
 * Animation frames stop while the tab is in the background. Clamping the delta
 * keeps the courier from teleporting down the route on the first frame after
 * the tab becomes visible again — the trip simply pauses while you are away.
 */
const MAX_FRAME_DELTA_MS = 250;

export type CourierTelemetry = {
  remainingMeters: number;
  etaMinutes: number;
};

export type CourierSimulation = {
  position: RoutePoint;
  headingDegrees: number;
  traveledMeters: number;
  progress: number;
  hasArrived: boolean;
  telemetry: CourierTelemetry;
};

type UseCourierSimulationOptions = {
  route: DeliveryRoute;
  /** Real-world courier speed used for the ETA, in meters per second */
  speedMetersPerSecond: number;
  /** Demo playback multiplier applied to elapsed time */
  timeScale: number;
  isRunning: boolean;
  /** Increment to replay the delivery from the restaurant */
  runId: number;
};

function buildTelemetry(
  traveledMeters: number,
  route: DeliveryRoute,
  speedMetersPerSecond: number,
): CourierTelemetry {
  const remainingMeters = Math.max(0, route.totalMeters - traveledMeters);
  const remainingSeconds = remainingMeters / speedMetersPerSecond;

  return {
    remainingMeters: Math.round(remainingMeters),
    etaMinutes:
      remainingMeters <= 0 ? 0 : Math.max(1, Math.ceil(remainingSeconds / 60)),
  };
}

export function useCourierSimulation({
  route,
  speedMetersPerSecond,
  timeScale,
  isRunning,
  runId,
}: UseCourierSimulationOptions): CourierSimulation {
  const traveledRef = useRef(0);
  const runIdRef = useRef(runId);
  const lastPingRef = useRef(0);

  const [traveledMeters, setTraveledMeters] = useState(0);
  const [telemetry, setTelemetry] = useState<CourierTelemetry>(() =>
    buildTelemetry(0, route, speedMetersPerSecond),
  );

  useEffect(() => {
    let frameId = 0;
    let previousTimestamp: number | null = null;

    const publish = (traveled: number, force: boolean) => {
      setTraveledMeters((previous) =>
        previous === traveled ? previous : traveled,
      );

      const elapsedSincePing = performance.now() - lastPingRef.current;
      const hasArrived = traveled >= route.totalMeters;

      if (!force && !hasArrived && elapsedSincePing < GPS_PING_MS) {
        return;
      }

      lastPingRef.current = performance.now();
      const next = buildTelemetry(traveled, route, speedMetersPerSecond);

      setTelemetry((previous) =>
        previous.remainingMeters === next.remainingMeters &&
        previous.etaMinutes === next.etaMinutes
          ? previous
          : next,
      );
    };

    const step = (timestamp: number) => {
      // A replay resets progress without tearing down the map instance.
      if (runIdRef.current !== runId) {
        runIdRef.current = runId;
        traveledRef.current = 0;
        previousTimestamp = timestamp;
        publish(0, true);
      }

      const deltaMs =
        previousTimestamp === null
          ? 0
          : Math.min(timestamp - previousTimestamp, MAX_FRAME_DELTA_MS);
      previousTimestamp = timestamp;

      if (isRunning && traveledRef.current < route.totalMeters) {
        const advance =
          (deltaMs / 1000) * speedMetersPerSecond * Math.max(timeScale, 0);
        traveledRef.current = Math.min(
          route.totalMeters,
          traveledRef.current + advance,
        );
      }

      publish(traveledRef.current, false);
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [isRunning, route, runId, speedMetersPerSecond, timeScale]);

  const { point, headingDegrees } = positionAtDistance(route, traveledMeters);

  return {
    position: point,
    headingDegrees,
    traveledMeters,
    progress:
      route.totalMeters > 0
        ? Math.min(1, traveledMeters / route.totalMeters)
        : 1,
    hasArrived: traveledMeters >= route.totalMeters,
    telemetry,
  };
}
