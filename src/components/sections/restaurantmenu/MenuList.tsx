"use client";

import Image from "next/image";
import { Plus, Utensils } from "lucide-react";
import { useCart } from "@/components/cart";
import { DealPricing } from "@/components/sections/homepage/DealCard";
import type { Lang } from "@/utils/getDictionary";
import {
  translateCategory,
  type CategoryTranslations,
} from "@/utils/categoryTranslations";
import MenuItemHashScroller from "./MenuItemHashScroller";
import type { MenuCategory } from "./types";

export interface MenuListProps {
  categories: MenuCategory[];
  lang: Lang;
  title: string;
  categoryTranslations: CategoryTranslations;
}

export default function MenuList({
  categories,
  lang,
  title,
  categoryTranslations,
}: MenuListProps) {
  const { addItem, isItemPending } = useCart();
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    {
      style: "currency",
      currency: "EUR",
    },
  );
  const formatPrice = (price: number) => priceFormatter.format(price);

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
                const isPending = isItemPending(item.id);
                const weeklyDiscountPercent =
                  item.weeklyDiscountPercent ?? null;
                const addLabel =
                  lang === "me" ? `Dodaj ${item.name}` : `Add ${item.name}`;

                return (
                  <article
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    data-testid={`menu-item-${item.id}`}
                    className="flex min-h-34 scroll-m-8 items-center gap-5 rounded-xl border border-black/10 bg-white p-5 shadow-[0_8px_26px_rgba(3,8,31,0.06)] ring-brand transition-[box-shadow,transform] duration-300 data-[highlighted=true]:-translate-y-0.5 data-[highlighted=true]:shadow-[0_12px_34px_rgba(252,138,6,0.18)] data-[highlighted=true]:ring-2"
                  >
                  <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand/10 text-brand">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Utensils aria-hidden="true" className="size-7" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-[17px] font-semibold leading-6 text-brand-ink">
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
                          <p className="text-[17px] font-bold text-brand">
                            {formatPrice(item.price)}
                          </p>
                        )}
                        <button
                          type="button"
                          aria-label={addLabel}
                          title={addLabel}
                          disabled={!item.isAvailable || isPending}
                          onClick={() => void addItem(item.id)}
                          className="flex size-10 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-brand-ink/20"
                        >
                          <Plus
                            aria-hidden="true"
                            className={`size-5 ${isPending ? "animate-pulse" : ""}`}
                          />
                        </button>
                      </div>
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-[13px] leading-5 text-brand-ink/65">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
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
