"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Tag } from "lucide-react";

import type { AllWeeklyDealsSectionProps } from "./types";

export default function AllWeeklyDealsSection({
  lang,
  content,
  deals,
  hasError,
}: AllWeeklyDealsSectionProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const locale = lang === "me" ? "sr-Latn-ME" : "en-GB";
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const dailyDeals = useMemo(
    () =>
      deals.flatMap((group, restaurantIndex) => {
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
      }),
    [deals, selectedDayIndex],
  );

  return (
    <section
      id="weekly-deals"
      aria-labelledby="weekly-deals-title"
      className="mx-auto mt-24 w-[calc(100%-2rem)] min-w-300 max-w-382 scroll-mt-8"
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
        <>
          <div className="special-reveal special-delay-1 mt-12 overflow-hidden rounded-[28px] border border-brand-ink/8 bg-brand-surface shadow-[0_20px_70px_rgba(3,8,31,0.08)]">
            <div className="flex items-start justify-between gap-10 bg-brand-ink px-10 py-8 text-white">
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

            <div className="max-h-145 overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{content.tableAriaLabel}</caption>
                <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_rgba(3,8,31,0.08)]">
                  <tr className="text-[12px] font-bold uppercase tracking-[0.08em] text-brand-ink/45">
                    <th className="px-8 py-5">{content.restaurantColumn}</th>
                    <th className="px-6 py-5">{content.dishColumn}</th>
                    <th className="px-6 py-5">{content.categoryColumn}</th>
                    <th className="px-6 py-5">{content.discountColumn}</th>
                    <th className="px-6 py-5">{content.priceColumn}</th>
                    <th className="px-8 py-5">
                      {content.availabilityColumn}
                    </th>
                  </tr>
                </thead>
                <tbody
                  key={selectedDayIndex}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {dailyDeals.map(({ restaurant, item }) => (
                    <tr
                      key={`${restaurant.id}-${item.id}`}
                      className="border-t border-brand-ink/6 bg-white transition-colors hover:bg-brand/5"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
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
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-brand-ink">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-brand-ink/60">
                        {item.menuCategory || content.categoryFallback}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[12px] font-bold text-white">
                          <Tag aria-hidden="true" className="size-3.5" />
                          -{item.weeklyDiscountPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-brand-green">
                          {formatPrice(item.discountedPrice)}
                        </span>
                        <span className="ml-2 text-[12px] text-brand-ink/35 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-green">
                          <CheckCircle2
                            aria-hidden="true"
                            className="size-4"
                          />
                          {content.availableLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}
    </section>
  );
}
