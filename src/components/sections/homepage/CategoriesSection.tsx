import type { CategoriesContent } from "@/utils/getDictionary";
import CategoryCard from "./CategoryCard";
import type { HomepageSectionProps } from "./types";

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
  restaurantCount: number;
  slug: string;
};

export type CategoriesSectionProps = Omit<
  HomepageSectionProps,
  "content"
> & {
  content: CategoriesContent;
  categories: Category[];
  hasError: boolean;
};

export default function CategoriesSection({
  content,
  categories,
  hasError,
}: CategoriesSectionProps) {
  return (
    <section
      aria-labelledby="categories-heading"
      className="mx-auto mt-16 w-[calc(100%-2rem)] min-w-300 max-w-382"
      data-testid="categories-section"
    >
      <h2
        id="categories-heading"
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
          className="mt-10 grid grid-cols-6 gap-5"
          data-testid="categories-grid"
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              restaurantCount={category.restaurantCount}
              restaurantsLabel={content.restaurantsLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
