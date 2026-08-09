"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PopularRestaurantCard from "@/components/sections/homepage/PopularRestaurantCard";
import type { Lang } from "@/utils/getDictionary";
import type { FeaturedRestaurantsContent } from "@/utils/getRestaurantDictionary";

export type FeaturedRestaurantsSectionProps = {
  lang: Lang;
  content: FeaturedRestaurantsContent;
};

export default function FeaturedRestaurantsSection({
  lang,
  content,
}: FeaturedRestaurantsSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [controls, setControls] = useState({
    canGoBack: false,
    canGoForward: true,
  });

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const updateControls = () => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

      setControls({
        canGoBack: carousel.scrollLeft > 2,
        canGoForward: carousel.scrollLeft < maxScrollLeft - 2,
      });
    };

    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(carousel);
    carousel.addEventListener("scroll", updateControls, { passive: true });

    return () => {
      resizeObserver.disconnect();
      carousel.removeEventListener("scroll", updateControls);
    };
  }, []);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollLeft += direction * carousel.clientWidth;
  };

  return (
    <section
      aria-labelledby="featured-restaurants-heading"
      aria-roledescription="carousel"
      aria-label={content.ariaLabel}
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382"
    >
      <div className="flex items-end justify-between gap-6">
        <h2
          id="featured-restaurants-heading"
          className="text-[28px] font-bold leading-tight text-brand-ink sm:text-[32px] sm:leading-12"
        >
          {content.title}
        </h2>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={content.previousLabel}
            disabled={!controls.canGoBack}
            onClick={() => moveCarousel(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink shadow-sm transition-colors hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-brand-ink/15 disabled:hover:bg-white disabled:hover:text-brand-ink"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={content.nextLabel}
            disabled={!controls.canGoForward}
            onClick={() => moveCarousel(1)}
            className="flex size-11 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink shadow-sm transition-colors hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-brand-ink/15 disabled:hover:bg-white disabled:hover:text-brand-ink"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="mt-8 flex snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {content.restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            role="group"
            aria-label={restaurant.name}
            className="min-w-[82%] snap-start sm:min-w-[calc((100%-1rem)/2)] lg:min-w-[calc((100%-3rem)/4)]"
          >
            <PopularRestaurantCard
              name={restaurant.name}
              logoUrl={restaurant.logoUrl}
              slug={restaurant.slug}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
