/**
 * Customer-facing cancellation rules.
 *
 * A customer may call off an order shortly after placing it — long enough to
 * catch a mistake, short enough that the kitchen has not committed food to it.
 * The rule lives here so the endpoint that enforces it and the payload that
 * advertises it can never disagree.
 */

const CANCELLATION_WINDOW_MINUTES = 5;

/** Once a courier has the food, cancelling is a support case, not a button. */
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PREPARING"];

const windowExpiryFor = (order) =>
  new Date(
    new Date(order.createdAt).getTime() + CANCELLATION_WINDOW_MINUTES * 60000,
  );

/**
 * Whether the customer can still cancel, and why not when they cannot.
 * `reason` is a stable code the client can map to its own copy.
 */
const getCancellationState = (order, now = new Date()) => {
  const expiresAt = windowExpiryFor(order);
  const base = {
    windowMinutes: CANCELLATION_WINDOW_MINUTES,
    expiresAt,
  };

  if (order.status === "CANCELLED") {
    return { ...base, canCancel: false, reason: "ALREADY_CANCELLED" };
  }

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return { ...base, canCancel: false, reason: "TOO_FAR_ALONG" };
  }

  if (now >= expiresAt) {
    return { ...base, canCancel: false, reason: "WINDOW_EXPIRED" };
  }

  return { ...base, canCancel: true, reason: null };
};

module.exports = {
  CANCELLABLE_STATUSES,
  CANCELLATION_WINDOW_MINUTES,
  getCancellationState,
};
