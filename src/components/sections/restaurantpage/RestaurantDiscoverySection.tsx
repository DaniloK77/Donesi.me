"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import {
  translateCategory,
  type CategoryTranslations,
} from "@/utils/categoryTranslations";
import type { RestaurantDiscoveryContent } from "@/utils/getRestaurantDictionary";
import RestaurantDiscoveryCard from "./RestaurantDiscoveryCard";

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverImageUrl?: string | null;
  category: string;
  rating: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  deliveryTimeMin: number;
  displayOrder: number;
};

export type RestaurantDiscoverySectionProps = {
  lang: Lang;
  content: RestaurantDiscoveryContent;
  restaurants: RestaurantSummary[];
  categoryTranslations: CategoryTranslations;
};

type SortOption = "featured" | "rating" | "delivery";

export default function RestaurantDiscoverySection({
  lang,
  content,
  restaurants,
  categoryTranslations,
}: RestaurantDiscoverySectionProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants
            .filter((restaurant) => restaurant.city === content.locationValue)
            .map((restaurant) => restaurant.category),
        ),
      ).sort((first, second) => first.localeCompare(second)),
    [content.locationValue, restaurants],
  );
  const visibleRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchesLocation = restaurant.city === content.locationValue;
      const matchesCategory =
        !selectedCategory || restaurant.category === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        restaurant.name.toLocaleLowerCase().includes(normalizedQuery) ||
        translateCategory(
          restaurant.category,
          categoryTranslations,
        )
          .toLocaleLowerCase()
          .includes(normalizedQuery);

      return matchesLocation && matchesCategory && matchesQuery;
    });

    return filteredRestaurants.toSorted((first, second) => {
      if (sortBy === "rating") {
        return second.rating - first.rating;
      }

      if (sortBy === "delivery") {
        return first.deliveryTimeMin - second.deliveryTimeMin;
      }

      return first.displayOrder - second.displayOrder;
    });
  }, [
    content.locationValue,
    query,
    restaurants,
    selectedCategory,
    sortBy,
    categoryTranslations,
  ]);
  const resultLabel =
    visibleRestaurants.length === 1
      ? content.resultLabel
      : content.resultsLabel;

  return (
    <section
      aria-labelledby="restaurant-discovery-heading"
      className="mx-auto mt-20 w-[calc(100%-2rem)] max-w-382"
    >
      <div className="flex items-end justify-between gap-8">
        <div>
          <h2
            id="restaurant-discovery-heading"
            className="text-[30px] font-bold leading-tight text-brand-ink sm:text-[36px]"
          >
            {content.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-6 text-brand-ink/65">
            {content.description}
          </p>
        </div>
        <p
          aria-live="polite"
          className="shrink-0 text-[14px] font-semibold text-brand-ink/60"
        >
          {visibleRestaurants.length} {resultLabel}
        </p>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-black/10 bg-brand-surface p-4 shadow-sm lg:grid-cols-[minmax(280px,1fr)_260px_220px]">
        <label className="relative block">
          <span className="sr-only">{content.searchLabel}</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-ink/45"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={content.searchPlaceholder}
            className="h-13 w-full rounded-xl border border-black/15 bg-white pl-12 pr-4 text-[14px] text-brand-ink outline-none transition-colors placeholder:text-brand-ink/40 focus:border-brand"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">{content.locationLabel}</span>
          <MapPin
            aria-hidden="true"
            className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-brand"
          />
          <select
            aria-label={content.locationLabel}
            defaultValue={content.locationValue}
            className="h-13 w-full appearance-none rounded-xl border border-black/15 bg-white pl-12 pr-10 text-[14px] font-medium text-brand-ink outline-none focus:border-brand"
          >
            <option value={content.locationValue}>
              {content.locationValue}
            </option>
          </select>
        </label>

        <label className="relative block">
          <span className="sr-only">{content.sortLabel}</span>
          <SlidersHorizontal
            aria-hidden="true"
            className="absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-brand-ink/55"
          />
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            aria-label={content.sortLabel}
            className="h-13 w-full appearance-none rounded-xl border border-black/15 bg-white pl-12 pr-10 text-[14px] font-medium text-brand-ink outline-none focus:border-brand"
          >
            <option value="featured">
              {content.sortOptions.featured}
            </option>
            <option value="rating">{content.sortOptions.rating}</option>
            <option value="delivery">
              {content.sortOptions.delivery}
            </option>
          </select>
        </label>
      </div>

      <div
        aria-label={content.categoryLabel}
        className="mt-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={!selectedCategory}
          onClick={() => setSelectedCategory("")}
          className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors ${
            !selectedCategory
              ? "border-brand bg-brand text-white"
              : "border-black/15 bg-white text-brand-ink hover:border-brand hover:text-brand"
          }`}
        >
          {content.allCategoriesLabel}
        </button>
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-black/15 bg-white text-brand-ink hover:border-brand hover:text-brand"
              }`}
            >
              {translateCategory(category, categoryTranslations)}
            </button>
          );
        })}
      </div>

      {visibleRestaurants.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleRestaurants.map((restaurant) => (
            <RestaurantDiscoveryCard
              key={restaurant.id}
              restaurant={restaurant}
              lang={lang}
              content={content}
              categoryTranslations={categoryTranslations}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 px-8 py-14 text-center">
          <h3 className="text-[20px] font-semibold text-brand-ink">
            {content.noResultsTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-[14px] leading-6 text-brand-ink/60">
            {content.noResultsMessage}
          </p>
        </div>
      )}
    </section>
  );
}
