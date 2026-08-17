"use client";

import { useCallback, useEffect, useState } from "react";

import { listOrders } from "./api";
import type { Order } from "./types";

/**
 * Keeps the customer's orders fresh while they watch the tracking page.
 *
 * Status changes originate elsewhere — an admin accepting the order, a
 * restaurant marking it ready — so the page has to ask again rather than wait
 * for a click. Polling is deliberately cheap: it pauses while the tab is
 * hidden and fires immediately when the customer comes back to it, which is
 * exactly when a stale status would be noticed.
 */

const DEFAULT_POLL_MS = 10000;

export type OrdersFeed = {
  orders: Order[] | null;
  hasError: boolean;
  refresh: () => Promise<void>;
  /** Replaces one order in place, e.g. with the result of a cancellation. */
  replaceOrder: (order: Order) => void;
};

export function useOrdersFeed(pollMs: number = DEFAULT_POLL_MS): OrdersFeed {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [hasError, setHasError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const result = await listOrders();
      setOrders(result);
      setHasError(false);
    } catch {
      setHasError(true);
      // Keep whatever we last showed; a failed poll should not blank the page.
      setOrders((previous) => previous ?? []);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    /**
     * `skipWhenHidden` keeps the *polling* quiet in a background tab. The first
     * load must never be skipped: a page opened in a background tab would
     * otherwise sit on its spinner until the customer focused it.
     */
    const load = (skipWhenHidden: boolean) => {
      if (
        isCancelled ||
        (skipWhenHidden && document.visibilityState !== "visible")
      ) {
        return;
      }

      listOrders()
        .then((result) => {
          if (!isCancelled) {
            setOrders(result);
            setHasError(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setHasError(true);
            // Keep whatever we last showed; a failed poll should not blank
            // the page out from under the customer.
            setOrders((previous) => previous ?? []);
          }
        });
    };

    const loadIfVisible = () => load(true);

    load(false);
    const intervalId = window.setInterval(loadIfVisible, pollMs);
    document.addEventListener("visibilitychange", loadIfVisible);
    window.addEventListener("focus", loadIfVisible);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", loadIfVisible);
      window.removeEventListener("focus", loadIfVisible);
    };
  }, [pollMs, refresh]);

  const replaceOrder = useCallback((updated: Order) => {
    setOrders((previous) =>
      previous
        ? previous.map((order) => (order.id === updated.id ? updated : order))
        : previous,
    );
  }, []);

  return { orders, hasError, refresh, replaceOrder };
}
