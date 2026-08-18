"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleOff,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

import {
  getRestaurantDealCategory,
  translateCategory,
} from "@/utils/categoryTranslations";
import { getMenuItemHash } from "@/utils/menuItemNavigation";
import type { DealCategory } from "@/utils/getDictionary";
import type { AllWeeklyDealsSectionProps } from "./types";

type CategoryFilter = "ALL" | DealCategory;
type DiscountSortOrder = "descending" | "ascending";

export default function AllWeeklyDealsSection({
  lang,
  content,
  deals,
  hasError,
  categoryTranslations,
}: AllWeeklyDealsSectionProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("ALL");
  const [sortOrder, setSortOrder] =
    useState<DiscountSortOrder>("descending");
  const locale = lang === "me" ? "sr-Latn-ME" : "en-GB";
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const dailyDeals = useMemo(() => {
    const selectedDeals = deals.flatMap((group, restaurantIndex) => {
      if (group.items.length === 0) {
        return [];
      }

      const item =
        group.items[
          (selectedDayIndex + restaurantIndex) % group.items.length
        ];

      return item
        ? [
            {
              restaurant: group.restaurant,
              item,
            },
          ]
        : [];
    });

    return selectedDeals
      .filter(
        ({ restaurant }) =>
          categoryFilter === "ALL" ||
          getRestaurantDealCategory(restaurant.category) ===
            categoryFilter,
      )
      .toSorted((first, second) => {
        const difference =
          first.item.weeklyDiscountPercent -
          second.item.weeklyDiscountPercent;

        return sortOrder === "ascending" ? difference : -difference;
      });
  }, [categoryFilter, deals, selectedDayIndex, sortOrder]);

  return (
    <section
      id="weekly-deals"
      aria-labelledby="weekly-deals-title"
      className="mx-auto mt-24 w-[calc(100%-2rem)] max-w-382 scroll-mt-8"
    >
      <div className="special-reveal flex items-end justify-between gap-20">
        <div className="max-w-220">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand">
            {content.eyebrow}
          </p>
          <h2
            id="weekly-deals-title"
            className="mt-3 text-[44px] font-bold leading-tight tracking-[-0.025em] text-brand-ink"
          >
            {content.title}
          </h2>
        </div>
        <p className="max-w-170 text-[16px] leading-7 text-brand-ink/65">
          {content.description}
        </p>
      </div>

      {hasError ? (
        <p
          role="alert"
          className="mt-10 rounded-2xl border border-brand/25 bg-brand/8 px-8 py-10 text-center text-brand-ink"
        >
          {content.error}
        </p>
      ) : deals.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-brand-surface px-8 py-10 text-center text-brand-ink">
          {content.empty}
        </p>
      ) : (
        <div className="special-reveal special-delay-1 mt-12 overflow-hidden rounded-[28px] border border-brand-ink/8 bg-brand-surface shadow-[0_20px_70px_rgba(3,8,31,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-8 bg-brand-ink px-10 py-8 text-white">
            <div>
              <div className="flex items-center gap-3">
                <CalendarDays
                  aria-hidden="true"
                  className="size-6 text-brand"
                />
                <h3 className="text-[26px] font-bold">
                  {content.scheduleTitle}
                </h3>
              </div>
              <p className="mt-2 max-w-190 text-[14px] leading-6 text-white/60">
                {content.scheduleDescription}
              </p>
            </div>

            <div
              role="tablist"
              aria-label={content.dayTabsAriaLabel}
              className="flex items-center rounded-full bg-white/8 p-1.5"
            >
              {content.days.map((day, index) => {
                const isSelected = selectedDayIndex === index;

                return (
                  <button
                    key={day.long}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={day.long}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`h-11 min-w-15 rounded-full px-4 text-[13px] font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      isSelected
                        ? "scale-105 bg-brand text-white shadow-lg"
                        : "text-white/65 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/8 bg-white px-8 py-4">
            <div
              role="tablist"
              aria-label={content.filterAriaLabel}
              className="flex flex-wrap items-center gap-1"
            >
              {content.filterTabs.map((tab) => {
                const isActive = categoryFilter === tab.category;

                return (
                  <button
                    key={tab.category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategoryFilter(tab.category)}
                    className={`h-10 rounded-full border-2 px-5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      isActive
                        ? "border-brand text-brand"
                        : "border-transparent text-brand-ink/65 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <label className="relative block min-w-58">
              <span className="sr-only">{content.sortLabel}</span>
              <SlidersHorizontal
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand"
              />
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as DiscountSortOrder)
                }
                aria-label={content.sortLabel}
                className="h-11 w-full appearance-none rounded-full border border-brand-ink/15 bg-brand-surface pl-10 pr-8 text-[13px] font-semibold text-brand-ink outline-none transition-colors focus:border-brand"
              >
                <option value="descending">
                  {content.sortDescendingLabel}
                </option>
                <option value="ascending">
                  {content.sortAscendingLabel}
                </option>
              </select>
            </label>
          </div>

          <div className="max-h-145 overflow-auto">
            <div
              role="table"
              aria-label={content.tableAriaLabel}
              className="min-w-245"
            >
              <div
                role="rowgroup"
                className="sticky top-0 z-20 bg-white shadow-[0_1px_0_rgba(3,8,31,0.08)]"
              >
                <div
                  role="row"
                  className="grid grid-cols-[1.25fr_1.15fr_0.85fr_0.65fr_0.9fr_0.8fr] text-[12px] font-bold uppercase tracking-[0.08em] text-brand-ink/45"
                >
                  <div role="columnheader" className="px-8 py-5">
                    {content.restaurantColumn}
                  </div>
                  <div role="columnheader" className="px-6 py-5">
                    {content.dishColumn}
                  </div>
                  <div role="columnheader" className="px-6 py-5">
                    {content.categoryColumn}
                  </div>
                  <div role="columnheader" className="px-6 py-5">
                    {content.discountColumn}
                  </div>
                  <div role="columnheader" className="px-6 py-5">
                    {content.priceColumn}
                  </div>
                  <div role="columnheader" className="px-8 py-5">
                    {content.availabilityColumn}
                  </div>
                </div>
              </div>

              <div
                key={`${selectedDayIndex}-${categoryFilter}-${sortOrder}`}
                role="rowgroup"
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {dailyDeals.length === 0 ? (
                  <div
                    role="row"
                    className="border-t border-brand-ink/6 bg-white"
                  >
                    <div
                      role="cell"
                      className="px-8 py-12 text-center text-[14px] text-brand-ink/55"
                    >
                      {content.noFilteredDeals}
                    </div>
                  </div>
                ) : (
                  dailyDeals.map(({ restaurant, item }) => {
                    const href = `/${lang}/restaurants/${restaurant.slug}${getMenuItemHash(item.id)}`;
                    const linkLabel = `${content.openOfferLabel}: ${item.name} — ${restaurant.name}`;
                    const rowContent = (
                      <>
                        <div role="cell" className="flex items-center px-8 py-4">
                          <span className="flex items-center gap-3">
                            <span className="relative size-10 overflow-hidden rounded-full border border-brand-ink/8 bg-white">
                              <Image
                                src={restaurant.logoUrl}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </span>
                            <span className="max-w-52 text-[14px] font-bold text-brand-ink">
                              {restaurant.name}
                            </span>
                          </span>
                        </div>
                        <div
                          role="cell"
                          className="flex items-center px-6 py-4 text-[14px] font-semibold text-brand-ink"
                        >
                          {item.name}
                        </div>
                        <div
                          role="cell"
                          className="flex items-center px-6 py-4 text-[13px] text-brand-ink/60"
                        >
                          {item.menuCategory
                            ? translateCategory(
                                item.menuCategory,
                                categoryTranslations,
                              )
                            : content.categoryFallback}
                        </div>
                        <div role="cell" className="flex items-center px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[12px] font-bold text-white">
                            <Tag aria-hidden="true" className="size-3.5" />-
                            {item.weeklyDiscountPercent}%
                          </span>
                        </div>
                        <div role="cell" className="flex items-center px-6 py-4">
                          <span className="text-[14px] font-bold text-brand-green">
                            {formatPrice(item.discountedPrice)}
                          </span>
                          <span className="ml-2 text-[12px] text-brand-ink/35 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        </div>
                        <div role="cell" className="flex items-center px-8 py-4">
                          <span
                            className={`inline-flex items-center gap-2 text-[13px] font-semibold ${
                              item.isAvailable
                                ? "text-brand-green"
                                : "text-red-700"
                            }`}
                          >
                            {item.isAvailable ? (
                              <CheckCircle2
                                aria-hidden="true"
                                className="size-4"
                              />
                            ) : (
                              <CircleOff
                                aria-hidden="true"
                                className="size-4"
                              />
                            )}
                            {item.isAvailable
                              ? content.availableLabel
                              : content.soldOutLabel}
                          </span>
                        </div>
                      </>
                    );
                    const rowClassName = `grid grid-cols-[1.25fr_1.15fr_0.85fr_0.65fr_0.9fr_0.8fr] border-t border-brand-ink/6 bg-white text-left transition-[background-color,box-shadow,opacity] ${
                      item.isAvailable
                        ? "group cursor-pointer hover:bg-brand/5 hover:shadow-[inset_4px_0_0_#fc8a06] focus-visible:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                        : "opacity-45"
                    }`;

                    return item.isAvailable ? (
                      <Link
                        key={`${restaurant.id}-${item.id}`}
                        href={href}
                        role="row"
                        aria-label={linkLabel}
                        className={rowClassName}
                      >
                        {rowContent}
                      </Link>
                    ) : (
                      <div
                        key={`${restaurant.id}-${item.id}`}
                        role="row"
                        className={rowClassName}
                      >
                        {rowContent}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
