"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Star } from "lucide-react";

import type { Lang } from "@/utils/getDictionary";
import type { AdminDictionary } from "@/utils/getAdminDictionary";
import type { AdminRestaurant } from "./types";

export default function AdminRestaurantsTab({
  lang,
  content,
  restaurants,
}: {
  lang: Lang;
  content: AdminDictionary;
  restaurants: AdminRestaurant[] | null;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const locale = lang === "me" ? "sr-Latn-ME" : "en-IE";
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  });
  const copy = content.restaurants;

  if (restaurants === null) {
    return (
      <div
        role="status"
        className="flex min-h-40 items-center justify-center rounded-3xl bg-brand-surface text-[15px] font-semibold text-brand-ink/60"
      >
        {content.loadingLabel}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <p className="rounded-3xl border border-brand-ink/8 bg-brand-surface px-6 py-10 text-center text-[14px] text-brand-ink/60">
        {copy.emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {restaurants.map((restaurant) => {
        const isExpanded = expandedId === restaurant.id;

        return (
          <article
            key={restaurant.id}
            className="overflow-hidden rounded-2xl border border-brand-ink/8 bg-white"
          >
            <div className="flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-bold text-brand-ink">
                  {restaurant.name}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-brand-ink/55">
                  <span>{restaurant.category}</span>
                  <span className="flex items-center gap-1">
                    <Star
                      aria-hidden="true"
                      className="size-3.5 fill-brand text-brand"
                    />
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {restaurant.address}
                  </span>
                  <span>
                    {copy.deliveryTimeLabel}: {restaurant.deliveryTimeMin}{" "}
                    {copy.minutesShort}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-brand-ink/40">
                  {restaurant.latitude.toFixed(5)},{" "}
                  {restaurant.longitude.toFixed(5)}
                </p>
              </div>

              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedId(isExpanded ? null : restaurant.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-ink/12 px-3.5 py-2 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand"
              >
                {restaurant.menuItemCount} {copy.menuItemsLabel}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {isExpanded ? (
              <div className="border-t border-brand-ink/8 bg-brand-surface p-5">
                {restaurant.menuCategories.map((category) => (
                  <div key={category.id} className="mb-5 last:mb-0">
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                      {category.name}
                    </h4>
                    <ul className="mt-2 space-y-1.5">
                      {category.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-4 text-[13px]"
                        >
                          <span className="min-w-0 truncate text-brand-ink">
                            {item.name}
                            {!item.isAvailable ? (
                              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                                {copy.unavailableLabel}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 font-semibold text-brand-ink">
                            {priceFormatter.format(item.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
