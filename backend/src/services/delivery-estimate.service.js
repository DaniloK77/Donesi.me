/**
 * Delivery time estimate, generated when an order is accepted.
 *
 * The promise the customer sees is prep time at the restaurant plus travel time
 * to their address, rounded to a friendly 5-minute step and clamped so we never
 * promise something implausible in either direction. Keeping it here means the
 * admin panel, the restaurant panel and any future auto-accept all quote the
 * same number.
 */

/** Average city courier speed, matching the tracking map's simulation. */
const COURIER_SPEED_METERS_PER_MINUTE = 6.5 * 60;
/** Handover at both ends: bagging the order, parking, finding the door. */
const HANDOVER_MINUTES = 4;
const ROUNDING_STEP_MINUTES = 5;
const MIN_ESTIMATE_MINUTES = 15;
const MAX_ESTIMATE_MINUTES = 90;
/** Used when the order has no coordinates to measure against. */
const FALLBACK_TRAVEL_MINUTES = 10;

const EARTH_RADIUS_METERS = 6371000;
const toRadians = (degrees) => (degrees * Math.PI) / 180;

const distanceInMeters = (from, to) => {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const halfChord =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(halfChord));
};

const hasCoordinates = (point) =>
  point &&
  typeof point.latitude === "number" &&
  typeof point.longitude === "number";

/**
 * Minutes to promise for an order.
 *
 * @param {object} input
 * @param {number} [input.prepTimeMinutes] restaurant's own prep estimate
 * @param {{latitude: number, longitude: number}|null} [input.pickup]
 * @param {{latitude: number, longitude: number}|null} [input.dropoff]
 * @param {boolean} [input.isPickup] customer collects it themselves
 */
const estimateDeliveryMinutes = ({
  prepTimeMinutes = 20,
  pickup = null,
  dropoff = null,
  isPickup = false,
}) => {
  // Nothing to drive when the customer collects the order.
  if (isPickup) {
    return clampToRange(roundToStep(prepTimeMinutes));
  }

  const travelMinutes =
    hasCoordinates(pickup) && hasCoordinates(dropoff)
      ? distanceInMeters(pickup, dropoff) / COURIER_SPEED_METERS_PER_MINUTE
      : FALLBACK_TRAVEL_MINUTES;

  return clampToRange(
    roundToStep(prepTimeMinutes + travelMinutes + HANDOVER_MINUTES),
  );
};

const roundToStep = (minutes) =>
  Math.round(minutes / ROUNDING_STEP_MINUTES) * ROUNDING_STEP_MINUTES;

const clampToRange = (minutes) =>
  Math.min(Math.max(minutes, MIN_ESTIMATE_MINUTES), MAX_ESTIMATE_MINUTES);

/**
 * The fields to write when an order is accepted: the promise in minutes and the
 * instant it points at, so clients can count down without trusting their clock
 * against ours for the starting point.
 */
const buildConfirmationEstimate = (input, confirmedAt = new Date()) => {
  const minutes = estimateDeliveryMinutes(input);

  return {
    confirmedAt,
    estimatedDeliveryMinutes: minutes,
    estimatedDeliveryAt: new Date(confirmedAt.getTime() + minutes * 60000),
  };
};

module.exports = {
  MAX_ESTIMATE_MINUTES,
  MIN_ESTIMATE_MINUTES,
  buildConfirmationEstimate,
  distanceInMeters,
  estimateDeliveryMinutes,
};
