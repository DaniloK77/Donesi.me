"use client";

import { useState } from "react";
import { Ban, Loader2 } from "lucide-react";

import type { TrackOrderDictionary } from "@/utils/getTrackOrderDictionary";
import { OrdersApiError, cancelOrder } from "./api";
import { formatCountdown, useCountdown } from "./useCountdown";
import type { Order } from "./types";

/**
 * Cancellation is offered for a short window after the order is placed. The
 * window and the eligibility come from the API (`order.cancellation`); this
 * component only counts it down and reports what the server answers — if the
 * two ever disagree, the server wins and its message is shown.
 */
export default function CancelOrderButton({
  order,
  content,
  onCancelled,
}: {
  order: Order;
  content: TrackOrderDictionary["cancellation"];
  onCancelled: (order: Order) => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { canCancel, expiresAt, reason } = order.cancellation;
  const remainingMs = useCountdown(canCancel ? expiresAt : null);
  const windowIsOpen = canCancel && (remainingMs ?? 0) > 0;

  const handleCancel = async () => {
    if (!window.confirm(content.confirmPrompt)) {
      return;
    }

    setIsCancelling(true);
    setError(null);

    try {
      onCancelled(await cancelOrder(order.id));
    } catch (cancelError) {
      setError(
        cancelError instanceof OrdersApiError && cancelError.message
          ? cancelError.message
          : content.genericError,
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (order.status === "CANCELLED") {
    return (
      <p className="mt-4 rounded-xl bg-brand-ink/5 px-4 py-2.5 text-[12px] text-brand-ink/60">
        {order.cancellation.cancelledBy === "CUSTOMER"
          ? content.cancelledByYou
          : content.cancelledByStore}
      </p>
    );
  }

  if (!windowIsOpen) {
    // Past the window there is nothing actionable left to show, except when the
    // order moved on while the page was open — then explain why it vanished.
    return reason === "WINDOW_EXPIRED" ? (
      <p className="mt-4 text-[11px] leading-4 text-brand-ink/45">
        {content.windowClosed}
      </p>
    ) : null;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isCancelling}
          onClick={() => void handleCancel()}
          className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {isCancelling ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : (
            <Ban aria-hidden="true" className="size-3.5" />
          )}
          {isCancelling ? content.cancelling : content.cancelButton}
        </button>

        <span aria-live="polite" className="text-[12px] text-brand-ink/55">
          {content.remainingPrefix}{" "}
          <strong className="font-semibold text-brand-ink">
            {formatCountdown(remainingMs ?? 0)}
          </strong>
        </span>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
