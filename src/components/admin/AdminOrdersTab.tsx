"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Map as MapIcon,
  PackageX,
  Trash2,
  X,
} from "lucide-react";

import type { Lang } from "@/utils/getDictionary";
import type { AdminDictionary } from "@/utils/getAdminDictionary";
import type { TrackOrderDictionary } from "@/utils/getTrackOrderDictionary";
import { OrderDeliveryTracking } from "@/components/orders";
import type { OrderStatus } from "@/components/orders/types";
import {
  assignCourier,
  deleteOrder as deleteOrderRequest,
  updateOrderStatus,
} from "./api";
import type { AdminOrder, CourierWithLoad } from "./types";

/** Which status each one moves to when the admin pushes the order forward. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-sky-100 text-sky-800",
  PREPARING: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-brand/15 text-brand",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
};

const FILTERS: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersTab({
  lang,
  content,
  deliveryContent,
  orders,
  couriers,
  onOrdersChange,
  onRefresh,
}: {
  lang: Lang;
  content: AdminDictionary;
  deliveryContent: TrackOrderDictionary["delivery"];
  orders: AdminOrder[] | null;
  couriers: CourierWithLoad[];
  onOrdersChange: (orders: AdminOrder[]) => void;
  onRefresh: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [busyOrderIds, setBusyOrderIds] = useState<string[]>([]);
  const [simulatingOrderId, setSimulatingOrderId] = useState<string | null>(
    null,
  );

  const locale = lang === "me" ? "sr-Latn-ME" : "en-IE";
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const copy = content.orders;

  const runOrderAction = async (
    orderId: string,
    action: () => Promise<AdminOrder | void>,
  ) => {
    setBusyOrderIds((previous) => [...previous, orderId]);

    try {
      const updated = await action();

      if (updated) {
        onOrdersChange(
          (orders ?? []).map((order) =>
            order.id === orderId ? updated : order,
          ),
        );
      } else {
        onOrdersChange((orders ?? []).filter((order) => order.id !== orderId));
      }

      onRefresh();
    } catch {
      onRefresh();
    } finally {
      setBusyOrderIds((previous) => previous.filter((id) => id !== orderId));
    }
  };

  const changeStatus = (orderId: string, status: OrderStatus) =>
    runOrderAction(orderId, () => updateOrderStatus(orderId, status));

  const changeCourier = (orderId: string, courierId: string | null) =>
    runOrderAction(orderId, () => assignCourier(orderId, courierId));

  const removeOrder = (orderId: string) => {
    if (!window.confirm(copy.deleteConfirmLabel)) {
      return;
    }

    return runOrderAction(orderId, async () => {
      await deleteOrderRequest(orderId);
    });
  };

  if (orders === null) {
    return (
      <div
        role="status"
        className="flex min-h-40 items-center justify-center rounded-3xl bg-brand-surface text-[15px] font-semibold text-brand-ink/60"
      >
        {content.loadingLabel}
      </div>
    );
  }

  const visibleOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              statusFilter === filter
                ? "bg-brand text-white"
                : "border border-brand-ink/12 text-brand-ink/60 hover:border-brand hover:text-brand"
            }`}
          >
            {filter === "ALL" ? copy.filterAll : content.statusLabels[filter]}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-brand-ink/8 bg-brand-surface px-8 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand/12 text-brand">
            <PackageX aria-hidden="true" className="size-6" />
          </span>
          <h3 className="mt-4 text-[18px] font-bold text-brand-ink">
            {copy.emptyTitle}
          </h3>
          <p className="mt-1.5 max-w-md text-[13px] leading-5 text-brand-ink/60">
            {copy.emptyMessage}
          </p>
        </div>
      ) : null}

      {visibleOrders.map((order) => {
        const isBusy = busyOrderIds.includes(order.id);
        const nextStatus = NEXT_STATUS[order.status];
        const restaurantName =
          order.restaurant?.name ?? order.items[0]?.restaurantName ?? "—";
        const canSimulate =
          order.deliveryType === "DELIVERY" &&
          order.restaurant?.latitude != null &&
          order.address?.latitude != null;
        const isSimulating = simulatingOrderId === order.id;

        return (
          <article
            key={order.id}
            className="rounded-3xl border border-brand-ink/8 bg-white p-5 shadow-[0_10px_36px_rgba(3,8,31,0.05)] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-ink/45">
                  {copy.orderLabel} #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-[13px] text-brand-ink/55">
                  {copy.placedOnLabel}{" "}
                  {dateFormatter.format(new Date(order.createdAt))}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_STYLES[order.status]}`}
              >
                {content.statusLabels[order.status]}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                  {copy.customerLabel}
                </dt>
                <dd className="mt-0.5 truncate text-[14px] font-medium text-brand-ink">
                  {order.customer.name}
                </dd>
                <dd className="truncate text-[12px] text-brand-ink/50">
                  {order.customer.phone ?? order.customer.email}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                  {copy.restaurantLabel}
                </dt>
                <dd className="mt-0.5 truncate text-[14px] font-medium text-brand-ink">
                  {restaurantName}
                </dd>
                <dd className="truncate text-[12px] text-brand-ink/50">
                  {order.deliveryType === "PICKUP"
                    ? copy.pickupOrderLabel
                    : (order.address?.street ?? "—")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                  {copy.totalLabel}
                </dt>
                <dd className="mt-0.5 text-[16px] font-bold text-brand-ink">
                  {priceFormatter.format(order.subtotal)}
                </dd>
                <dd className="truncate text-[12px] text-brand-ink/50">
                  {order.items.length} × {copy.itemsLabel.toLowerCase()}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-brand-ink/8 pt-4">
              <label className="flex items-center gap-2 text-[12px] text-brand-ink/55">
                <span className="sr-only sm:not-sr-only">
                  {copy.courierLabel}
                </span>
                <select
                  value={order.courier?.id ?? ""}
                  disabled={isBusy}
                  onChange={(event) =>
                    changeCourier(order.id, event.target.value || null)
                  }
                  className="rounded-full border border-brand-ink/12 bg-white px-3 py-1.5 text-[12px] font-semibold text-brand-ink disabled:opacity-50"
                >
                  <option value="">{copy.noCourierLabel}</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>
                      {courier.name} ·{" "}
                      {content.people.vehicleLabels[courier.vehicle]}
                    </option>
                  ))}
                </select>
              </label>

              {order.status === "PENDING" ? (
                <>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => changeStatus(order.id, "CONFIRMED")}
                    className="flex items-center gap-1.5 rounded-full bg-brand-green px-3.5 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <Check aria-hidden="true" className="size-3.5" />
                    {copy.acceptLabel}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => changeStatus(order.id, "CANCELLED")}
                    className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-[12px] font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <X aria-hidden="true" className="size-3.5" />
                    {copy.rejectLabel}
                  </button>
                </>
              ) : null}

              {order.status !== "PENDING" && nextStatus ? (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => changeStatus(order.id, nextStatus)}
                  className="flex items-center gap-1.5 rounded-full bg-brand-ink px-3.5 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {nextStatus === "DELIVERED"
                    ? copy.markDeliveredLabel
                    : `${copy.advanceLabel}: ${content.statusLabels[nextStatus]}`}
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </button>
              ) : null}

              {canSimulate ? (
                <button
                  type="button"
                  onClick={() =>
                    setSimulatingOrderId(isSimulating ? null : order.id)
                  }
                  className="flex items-center gap-1.5 rounded-full border border-brand-ink/12 px-3.5 py-2 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <MapIcon aria-hidden="true" className="size-3.5" />
                  {isSimulating ? copy.hideSimulationLabel : copy.simulateLabel}
                </button>
              ) : null}

              <button
                type="button"
                disabled={isBusy}
                onClick={() => removeOrder(order.id)}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-brand-ink/12 px-3.5 py-2 text-[12px] font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="size-3.5" />
                {copy.deleteLabel}
              </button>

              {isBusy ? (
                <span
                  aria-live="polite"
                  className="text-[12px] font-medium text-brand-ink/50"
                >
                  {copy.updatingLabel}
                </span>
              ) : null}
            </div>

            {isSimulating ? (
              <>
                {order.status !== "OUT_FOR_DELIVERY" ? (
                  <p className="mt-4 rounded-xl bg-brand-surface px-4 py-2.5 text-[12px] text-brand-ink/55">
                    {copy.simulationHint}
                  </p>
                ) : null}
                <OrderDeliveryTracking
                  order={order}
                  lang={lang}
                  content={deliveryContent}
                />
              </>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
