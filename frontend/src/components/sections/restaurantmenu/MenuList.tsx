"use client";

import Image from "next/image";
import { isRemoteImage } from "@/lib/menu-image";
import { Plus, Utensils } from "lucide-react";
import { useCart } from "@/components/cart";
import { DealPricing } from "@/components/sections/homepage/DealCard";
import type { Lang } from "@/utils/getDictionary";
import {
  translateCategory,
  type CategoryTranslations,
} from "@/utils/categoryTranslations";
import MenuItemHashScroller from "./MenuItemHashScroller";
import type {
  CustomizableItem,
  MenuCategory,
} from "./types";

export interface MenuListProps {
  categories: MenuCategory[];
  lang: Lang;
  title: string;
  categoryTranslations: CategoryTranslations;
  onRequestCustomize?: (item: CustomizableItem) => void;
}

export default function MenuList({
  categories,
  lang,
  title,
  categoryTranslations,
  onRequestCustomize,
}: MenuListProps) {
  const { addItem } = useCart();
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    {
      style: "currency",
      currency: "EUR",
    },
  );
  const formatPrice = (price: number) => priceFormatter.format(price);
  const openCustomization = (item: CustomizableItem) => {
    if (onRequestCustomize) {
      onRequestCustomize(item);
      return;
    }

    void addItem(item.id);
  };

  return (
    <section
      aria-labelledby="restaurant-menu-heading"
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382"
    >
      <MenuItemHashScroller />
      <h2
        id="restaurant-menu-heading"
        className="text-[34px] font-bold text-brand-ink"
      >
        {title}
      </h2>

      <div className="mt-10 space-y-14">
        {categories.map((category) => (
          <section
            key={category.id}
            aria-labelledby={`menu-category-${category.id}`}
          >
            <h3
              id={`menu-category-${category.id}`}
              className="text-[26px] font-semibold text-brand-ink"
            >
              {translateCategory(category.name, categoryTranslations)}
            </h3>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {category.items.map((item) => {
                const weeklyDiscountPercent =
                  item.weeklyDiscountPercent ?? null;
                const customizeLabel =
                  lang === "me"
                    ? item.customization?.enabled
                      ? `Prilagodi ${item.name}`
                      : `Dodaj ${item.name}`
                    : item.customization?.enabled
                      ? `Customize ${item.name}`
                      : `Add ${item.name}`;

                return (
                  <article
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    data-testid={`menu-item-${item.id}`}
                    className="flex min-h-34 scroll-m-8 items-center gap-3 rounded-xl border border-black/10 bg-white p-4 sm:gap-5 sm:p-5 shadow-[0_8px_26px_rgba(3,8,31,0.06)] ring-brand transition-[box-shadow,transform] duration-300 data-[highlighted=true]:-translate-y-0.5 data-[highlighted=true]:shadow-[0_12px_34px_rgba(252,138,6,0.18)] data-[highlighted=true]:ring-2"
                  >
                    <button
                      type="button"
                      onClick={() => openCustomization(item)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-5"
                      aria-label={customizeLabel}
                    >
                      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand/10 text-brand sm:size-20">
                        {item.imageUrl ? (
                          isRemoteImage(item.imageUrl) ? (
                            // Administrator-supplied host: not whitelisted for
                            // next/image, so render it directly.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt=""
                              loading="lazy"
                              className="size-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          )
                        ) : (
                          <Utensils aria-hidden="true" className="size-7" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <h4 className="min-w-0 break-words text-[15px] font-semibold leading-5 text-brand-ink sm:text-[17px] sm:leading-6">
                            {item.name}
                          </h4>
                          <div className="flex shrink-0 items-center gap-3">
                            {weeklyDiscountPercent ? (
                              <DealPricing
                                originalPrice={item.price}
                                discountPercentage={weeklyDiscountPercent}
                                formatPrice={formatPrice}
                              />
                            ) : (
                              <p className="text-[16px] font-bold text-brand sm:text-[17px]">
                                {formatPrice(item.price)}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.description ? (
                          <p className="mt-2 hidden text-[13px] leading-5 text-brand-ink/65 sm:block">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </button>

                    <button
                      type="button"
                      aria-label={customizeLabel}
                      title={customizeLabel}
                      onClick={() => openCustomization(item)}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover sm:size-10"
                    >
                      <Plus aria-hidden="true" className="size-5" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

    </section>
  );
}
