import type { PopularRestaurantsContent } from "@/utils/getDictionary";
import PopularRestaurantCard from "./PopularRestaurantCard";
import type { HomepageSectionProps } from "./types";

const MAX_POPULAR_RESTAURANTS = 6;

export type PopularRestaurant = {
  id: string;
  name: string;
  logoUrl: string;
  slug: string;
  displayOrder: number;
};

export type PopularRestaurantsSectionProps = Omit<
  HomepageSectionProps,
  "content"
> & {
  content: PopularRestaurantsContent;
  restaurants: PopularRestaurant[];
  hasError: boolean;
};

export default function PopularRestaurantsSection({
  lang,
  content,
  restaurants,
  hasError,
}: PopularRestaurantsSectionProps) {
  const visibleRestaurants = restaurants.slice(0, MAX_POPULAR_RESTAURANTS);

  return (
    <section
      aria-labelledby="popular-restaurants-heading"
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382"
      data-testid="popular-restaurants-section"
    >
      <h2
        id="popular-restaurants-heading"
        className="text-[32px] font-bold leading-12 text-brand-ink"
      >
        {content.title}
      </h2>

      {hasError ? (
        <p
          className="mt-10 rounded-xl border border-brand/30 bg-brand/5 px-6 py-8 text-center text-base text-brand-ink"
          role="alert"
        >
          {content.error}
        </p>
      ) : (
        <div
          className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
          data-testid="popular-restaurants-grid"
        >
          {visibleRestaurants.map((restaurant) => (
            <PopularRestaurantCard
              key={restaurant.id}
              name={restaurant.name}
              logoUrl={restaurant.logoUrl}
              slug={restaurant.slug}
              lang={lang}
            />
          ))}
        </div>
      )}
    </section>
  );
}
