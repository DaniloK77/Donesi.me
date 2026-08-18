"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DealCategory,
  DealsContent,
} from "@/utils/getDictionary";
import DealCard from "./DealCard";
import type { HomepageSectionProps } from "./types";

export type Deal = {
  id: string;
  name: string;
  label: string | null;
  imageUrl: string;
  discountPercentage: number;
  category: DealCategory;
};

export type DealsSectionProps = Omit<HomepageSectionProps, "content"> & {
  content: DealsContent;
  initialDeals: Deal[];
  initialError: boolean;
  apiUrl: string;
};

const defaultCategory: DealCategory = "PIZZA_FASTFOOD";

export default function DealsSection({
  content,
  initialDeals,
  initialError,
  apiUrl,
}: DealsSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<DealCategory>(defaultCategory);
  const [deals, setDeals] = useState(initialDeals);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError ? content.error : null);
  const previousCategory = useRef<DealCategory>(defaultCategory);

  useEffect(() => {
    if (previousCategory.current === activeCategory) {
      return;
    }

    previousCategory.current = activeCategory;
    const controller = new AbortController();

    async function loadDeals() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiUrl}/api/deals?category=${activeCategory}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Deals request failed with ${response.status}`);
        }

        const nextDeals = (await response.json()) as Deal[];
        setDeals(nextDeals);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setDeals([]);
        setError(content.error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadDeals();

    return () => {
      controller.abort();
    };
  }, [activeCategory, apiUrl, content.error]);

  return (
    <section
      aria-labelledby="deals-heading"
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382"
      data-testid="deals-section"
    >
      <div className="flex items-center justify-between gap-10">
        <h2
          id="deals-heading"
          className="text-[24px] font-bold leading-8 text-brand-ink sm:text-[32px] sm:leading-12"
        >
          {content.title}
        </h2>

        <div
          aria-label={content.tabsAriaLabel}
          className="-mx-1 flex items-center gap-3 overflow-x-auto px-1 pb-1 sm:gap-5 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {content.tabs.map((tab) => {
            const isActive = tab.category === activeCategory;

            return (
              <button
                key={tab.category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab.category)}
                className={`h-13 rounded-[120px] border-2 px-8 text-base font-medium transition-colors ${
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-brand-ink hover:border-brand hover:text-brand"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <div
            aria-live="polite"
            className="grid grid-cols-3 gap-5"
            data-testid="deals-loading"
          >
            <span className="sr-only">{content.loading}</span>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-83 animate-pulse rounded-xl bg-black/10"
              />
            ))}
          </div>
        ) : error ? (
          <p
            className="rounded-xl border border-brand/30 bg-brand/5 px-6 py-8 text-center text-base text-brand-ink"
            role="alert"
          >
            {error}
          </p>
        ) : deals.length === 0 ? (
          <p className="rounded-xl bg-brand-surface px-6 py-8 text-center text-base text-brand-ink">
            {content.empty}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-5" data-testid="deals-grid">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                name={deal.name}
                label={deal.label ?? undefined}
                imageUrl={deal.imageUrl}
                discountPercentage={deal.discountPercentage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
