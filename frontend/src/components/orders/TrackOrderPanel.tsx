"use client";

import Link from "next/link";
import {
  Banknote,
  Check,
  MapPin,
  PackageX,
  RefreshCw,
  ShoppingBag,
  Timer,
} from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import type { TrackOrderDictionary } from "@/utils/getTrackOrderDictionary";
import CancelOrderButton from "./CancelOrderButton";
import OrderDeliveryTracking from "./OrderDeliveryTracking";
import { toMinutes, useCountdown } from "./useCountdown";
import { useOrdersFeed } from "./useOrdersFeed";
import type { Order, OrderDeliveryType } from "./types";

const STEP_KEYS = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

type StepKey = (typeof STEP_KEYS)[number];

function getStepLabel(
  stepKey: StepKey,
  deliveryType: OrderDeliveryType,
  labels: TrackOrderDictionary["statusLabels"],
) {
  if (stepKey === "OUT_FOR_DELIVERY") {
    return deliveryType === "PICKUP"
      ? labels.OUT_FOR_PICKUP
      : labels.OUT_FOR_DELIVERY;
  }

  if (stepKey === "DELIVERED") {
    return deliveryType === "PICKUP" ? labels.PICKED_UP : labels.DELIVERED;
  }

  return labels[stepKey];
}

function OrderStatusStepper({
  order,
  labels,
}: {
  order: Order;
  labels: TrackOrderDictionary["statusLabels"];
}) {
  if (order.status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
        <PackageX aria-hidden="true" className="size-4" />
        {labels.CANCELLED}
      </div>
    );
  }

  const currentIndex = STEP_KEYS.indexOf(order.status as StepKey);
  const currentLabel = getStepLabel(
    STEP_KEYS[Math.max(0, currentIndex)],
    order.deliveryType,
    labels,
  );

  return (
    <>
      <ol className="flex items-start gap-1">
      {STEP_KEYS.map((stepKey, index) => {
        const isDone = index <= currentIndex;

        return (
          <li
            key={stepKey}
            className="flex flex-1 flex-col items-center gap-1.5 text-center"
          >
            <div className="flex w-full items-center">
              <span
                className={`h-0.75 flex-1 ${
                  index === 0
                    ? "bg-transparent"
                    : index <= currentIndex
                      ? "bg-brand"
                      : "bg-brand-ink/12"
                }`}
              />
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  isDone
                    ? "bg-brand text-white"
                    : "bg-brand-ink/10 text-brand-ink/40"
                }`}
              >
                {isDone ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
              </span>
              <span
                className={`h-0.75 flex-1 ${
                  index === STEP_KEYS.length - 1
                    ? "bg-transparent"
                    : index < currentIndex
                      ? "bg-brand"
                      : "bg-brand-ink/12"
                }`}
              />
            </div>
            {/* Five labels do not fit under 360px, so below `sm` the current
                step is named once underneath the track instead. */}
            <span
              className={`hidden text-[11px] font-medium leading-tight sm:block ${
                isDone ? "text-brand-ink" : "text-brand-ink/40"
              }`}
            >
              {getStepLabel(stepKey, order.deliveryType, labels)}
            </span>
          </li>
        );
      })}
      </ol>

      <p className="mt-2 text-center text-[13px] font-semibold text-brand-ink sm:hidden">
        {currentLabel}
      </p>
    </>
  );
}

/**
 * The delivery promise made when the order was accepted, counted down live.
 * Before acceptance there is no promise to show yet — only that we are waiting
 * on the restaurant.
 */
function DeliveryEstimate({
  order,
  content,
}: {
  order: Order;
  content: TrackOrderDictionary;
}) {
  const remainingMs = useCountdown(order.estimate?.at ?? null);

  if (order.status === "CANCELLED" || order.status === "DELIVERED") {
    return null;
  }

  if (!order.estimate) {
    return (
      <p className="mt-4 flex items-center gap-2 rounded-2xl bg-brand-surface px-4 py-3 text-[13px] text-brand-ink/60">
        <Timer aria-hidden="true" className="size-4 shrink-0 text-brand-ink/40" />
        {content.estimatePendingLabel}
      </p>
    );
  }

  const minutesLeft = toMinutes(remainingMs ?? 0);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/25 bg-brand/8 px-4 py-3">
      <span className="flex items-center gap-2 text-[13px] font-medium text-brand-ink/70">
        <Timer aria-hidden="true" className="size-4 text-brand" />
        {content.estimateLabel}
      </span>
      <strong aria-live="polite" className="text-[16px] text-brand-ink">
        {minutesLeft > 0
          ? `~ ${minutesLeft} ${content.estimateMinutesSuffix}`
          : content.estimateArrivingNow}
      </strong>
    </div>
  );
}

export default function TrackOrderPanel({
  lang,
  content,
}: {
  lang: Lang;
  content: TrackOrderDictionary;
}) {
  const { orders, hasError, replaceOrder } = useOrdersFeed();
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    { style: "currency", currency: "EUR" },
  );
  const dateFormatter = new Intl.DateTimeFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    { dateStyle: "medium", timeStyle: "short" },
  );

  if (orders === null) {
    return (
      <div
        role="status"
        className="mx-auto flex min-h-60 w-[calc(100%-2rem)] max-w-382 items-center justify-center rounded-3xl bg-brand-surface text-[15px] font-semibold text-brand-ink/60"
      >
        {content.loadingLabel}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto w-[calc(100%-2rem)] max-w-382">
        <div className="flex flex-col items-center rounded-3xl border border-brand-ink/8 bg-brand-surface px-8 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand/12 text-brand">
            <ShoppingBag aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-5 text-[22px] font-bold text-brand-ink">
            {content.emptyTitle}
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-brand-ink/60">
            {content.emptyMessage}
          </p>
          <Link
            href={`/${lang}`}
            className="mt-6 rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {content.browseCta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-[calc(100%-2rem)] max-w-382 flex-col gap-6">
      {hasError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {content.genericErrorLabel}
        </p>
      ) : (
        <p className="hidden items-center gap-1.5 text-[12px] text-brand-ink/45 sm:flex">
          <RefreshCw aria-hidden="true" className="size-3.5" />
          {content.liveUpdatesLabel}
        </p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-3xl border border-brand-ink/8 bg-white p-6 shadow-[0_16px_50px_rgba(3,8,31,0.06)] sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-ink/45">
                {content.orderLabel} #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="mt-1 text-[13px] text-brand-ink/55">
                {content.placedOnLabel}{" "}
                {dateFormatter.format(new Date(order.createdAt))}
              </p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[12px] font-semibold text-brand">
              {content.deliveryTypeLabels[order.deliveryType]}
            </span>
          </div>

          <div className="mt-6">
            <OrderStatusStepper order={order} labels={content.statusLabels} />
          </div>

          <DeliveryEstimate order={order} content={content} />

          <CancelOrderButton
            order={order}
            content={content.cancellation}
            onCancelled={replaceOrder}
          />

          {/* Step 4: live courier map, delivery orders only. */}
          {order.status === "OUT_FOR_DELIVERY" &&
          order.deliveryType === "DELIVERY" ? (
            <OrderDeliveryTracking
              order={order}
              lang={lang}
              content={content.delivery}
            />
          ) : null}

          {order.deliveryType === "DELIVERY" && order.address ? (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-brand-surface p-4">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-brand"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                  {content.addressLabel}
                </p>
                <p className="mt-0.5 text-[14px] font-medium text-brand-ink">
                  {order.address.street}
                  {order.address.city ? `, ${order.address.city}` : ""}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 border-t border-brand-ink/8 pt-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
              {content.itemsLabel}
            </p>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-[14px] text-brand-ink"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-semibold">{item.quantity}×</span>{" "}
                    {item.name}
                    <span className="text-brand-ink/45">
                      {" "}
                      · {item.restaurantName}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">
                    {priceFormatter.format(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-brand-ink/8 pt-5">
            <span className="text-[14px] font-medium text-brand-ink/65">
              {content.totalLabel}
            </span>
            <strong className="text-[20px] text-brand-ink">
              {priceFormatter.format(order.subtotal)}
            </strong>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-brand-surface px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] font-medium text-brand-ink">
              <Banknote aria-hidden="true" className="size-4 text-brand" />
              {content.paymentLabel}: {content.paymentCashOnDelivery}
            </span>
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" ? (
              <span className="hidden text-[12px] text-brand-ink/55 sm:inline">
                {content.paymentPrepareLabel}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
