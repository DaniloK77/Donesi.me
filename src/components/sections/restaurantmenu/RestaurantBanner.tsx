"use client";

import Image from "next/image";
import { Clock3, Star } from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import type { RestaurantMenuPageContent } from "@/utils/getRestaurantDictionary";
import FeaturedItemsCarousel from "./FeaturedItemsCarousel";
import type { FeaturedItem } from "./types";

export interface RestaurantBannerProps {
  name: string;
  logoUrl: string;
  coverImageUrl?: string | null;
  category: string;
  rating: number;
  deliveryTimeMin: number;
  featuredItems: FeaturedItem[];
  lang: Lang;
  content: RestaurantMenuPageContent;
}

export default function RestaurantBanner({
  name,
  logoUrl,
  coverImageUrl,
  category,
  rating,
  deliveryTimeMin,
  featuredItems,
  lang,
  content,
}: RestaurantBannerProps) {
  return (
    <section
      aria-labelledby="restaurant-banner-heading"
      className="mx-auto w-[calc(100%-2rem)] max-w-382 overflow-hidden rounded-xl bg-brand-ink"
    >
      <div className="relative min-h-85 overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1536px) calc(100vw - 2rem), 1528px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(252,138,6,0.48),transparent_34%),linear-gradient(120deg,#03081f_30%,#18213e_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/55 to-transparent" />

        <div className="relative z-10 flex min-h-85 items-center gap-7 px-8 py-12 lg:px-14">
          <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 text-white">
            <p className="text-[16px] font-medium text-white/75">
              {category}
            </p>
            <h1
              id="restaurant-banner-heading"
              className="mt-2 text-[52px] font-semibold leading-tight tracking-[-0.02em]"
            >
              {name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div
                aria-label={`${content.ratingLabel}: ${rating.toFixed(1)}`}
                className="flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4"
              >
                <Star
                  aria-hidden="true"
                  className="size-5 fill-[#FFB800] text-[#FFB800]"
                />
                <span className="text-[14px] font-semibold">
                  {rating.toFixed(1)}
                </span>
              </div>

              <div className="flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4">
                <Clock3 aria-hidden="true" className="size-5" />
                <span className="text-[14px] font-semibold">
                  {content.deliveryLabel}: {deliveryTimeMin} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedItemsCarousel
        items={featuredItems}
        lang={lang}
        title={content.featuredItemsTitle}
        ariaLabel={content.featuredItemsAriaLabel}
        previousLabel={content.previousItemsLabel}
        nextLabel={content.nextItemsLabel}
        imageFallbackLabel={content.itemImageFallback}
      />
    </section>
  );
}
