"use client";

import { useEffect, useState } from "react";

/**
 * Milliseconds left until `target`, re-rendering once a second until it hits
 * zero. Used for both the delivery estimate and the cancellation window so the
 * two counters behave identically.
 *
 * The remaining time is derived at render rather than stored, so a tab that was
 * asleep shows the correct value on its first paint instead of a stale one.
 * Returns null when there is no target, which saves callers from special-casing
 * "no estimate yet".
 */
export function useCountdown(target: string | null): number | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) {
      return;
    }

    const targetMs = new Date(target).getTime();
    const sync = () => setNow(Date.now());

    // Re-sync on the next tick rather than during the effect: the component may
    // be mounting in a tab that was asleep, where `now` is far out of date.
    const timeoutId = window.setTimeout(sync, 0);
    const intervalId = window.setInterval(() => {
      sync();

      if (targetMs <= Date.now()) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [target]);

  if (!target) {
    return null;
  }

  return Math.max(0, new Date(target).getTime() - now);
}

/** Formats a duration as `m:ss`, for the cancellation window. */
export function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Whole minutes left, rounded up, for the delivery estimate. */
export function toMinutes(remainingMs: number) {
  return Math.max(0, Math.ceil(remainingMs / 60000));
}
