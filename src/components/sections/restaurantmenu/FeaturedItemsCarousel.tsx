"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Utensils,
} from "lucide-react";
import { useCart } from "@/components/cart";
import type { Lang } from "@/utils/getDictionary";
import type { FeaturedItem } from "./types";

export interface FeaturedItemsCarouselProps {
  items: FeaturedItem[];
  lang: Lang;
  title: string;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  imageFallbackLabel: string;
}

const getMenuItemId = (itemId: string) => `menu-item-${itemId}`;

export default function FeaturedItemsCarousel({
  items,
  lang,
  title,
  ariaLabel,
  previousLabel,
  nextLabel,
  imageFallbackLabel,
}: FeaturedItemsCarouselProps) {
  const { addItem, isItemPending } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(items.length > 1);
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    {
      style: "currency",
      currency: "EUR",
    },
  );

  const updateControls = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanGoBack(carousel.scrollLeft > 2);
    setCanGoForward(carousel.scrollLeft < maxScrollLeft - 2);
  };

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollLeft += direction * carousel.clientWidth * 0.8;
  };

  const focusMenuItem = (itemId: string) => {
    const menuItem = document.getElementById(getMenuItemId(itemId));

    if (!menuItem) {
      return;
    }

    menuItem.scrollIntoView({ behavior: "smooth", block: "center" });
    menuItem.dataset.highlighted = "true";

    window.setTimeout(() => {
      delete menuItem.dataset.highlighted;
    }, 1800);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="border-t border-white/15 px-8 pb-8 pt-7 lg:px-14"
    >
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-[24px] font-semibold text-white">{title}</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={!canGoBack}
            onClick={() => moveCarousel(-1)}
            className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={!canGoForward}
            onClick={() => moveCarousel(1)}
            className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        onScroll={updateControls}
        className="mt-5 flex snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isPending = isItemPending(item.id);
          const addLabel =
            lang === "me" ? `Dodaj ${item.name}` : `Add ${item.name}`;

          return (
            <div
              key={item.id}
              data-testid={`featured-item-${item.id}`}
              className="group flex min-w-70 snap-start overflow-hidden rounded-xl border border-white/15 bg-white text-left shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <button
                type="button"
                onClick={() => focusMenuItem(item.id)}
                className="flex min-w-0 flex-1 text-left"
              >
                <span className="relative size-24 shrink-0 overflow-hidden bg-brand/10">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      title={imageFallbackLabel}
                      className="flex size-full items-center justify-center bg-gradient-to-br from-brand/15 to-brand/35 text-brand"
                    >
                      <Utensils aria-hidden="true" className="size-8" />
                      <span className="sr-only">{imageFallbackLabel}</span>
                    </span>
                  )}
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                  <span className="line-clamp-2 text-[14px] font-semibold leading-5 text-brand-ink">
                    {item.name}
                  </span>
                  <span className="mt-1 text-[14px] font-bold text-brand">
                    {priceFormatter.format(item.price)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={addLabel}
                title={addLabel}
                disabled={isPending}
                onClick={() => void addItem(item.id)}
                className="m-3 ml-0 flex size-9 shrink-0 self-center items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:bg-brand-ink/20"
              >
                <Plus
                  aria-hidden="true"
                  className={`size-4.5 ${isPending ? "animate-pulse" : ""}`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
