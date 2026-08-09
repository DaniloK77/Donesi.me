"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import type { CustomerReviewsContent } from "@/utils/getRestaurantDictionary";
import ReviewCard from "./ReviewCard";
import type { RestaurantReview } from "./types";

export interface CustomerReviewsSectionProps {
  reviews: RestaurantReview[];
  lang: Lang;
  content: CustomerReviewsContent;
}

const visibleReviewCount = 2;

export default function CustomerReviewsSection({
  reviews,
  lang,
  content,
}: CustomerReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, reviews.length - visibleReviewCount);
  const visibleReviews = reviews.slice(
    currentIndex,
    currentIndex + visibleReviewCount,
  );
  const dateFormatter = new Intl.DateTimeFormat(
    lang === "me" ? "sr-Latn-ME" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Podgorica",
    },
  );

  const showPreviousReviews = () => {
    setCurrentIndex((index) =>
      Math.max(0, index - visibleReviewCount),
    );
  };

  const showNextReviews = () => {
    setCurrentIndex((index) =>
      Math.min(maxIndex, index + visibleReviewCount),
    );
  };

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      aria-roledescription="carousel"
      aria-label={content.ariaLabel}
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382 rounded-xl bg-[#eeeeee] px-12 py-12"
    >
      <div className="flex items-center justify-between gap-8">
        <h2
          id="customer-reviews-heading"
          className="text-[34px] font-bold text-brand-ink"
        >
          {content.title}
        </h2>

        {reviews.length > 0 ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={content.previousLabel}
              disabled={currentIndex === 0}
              onClick={showPreviousReviews}
              className="flex size-11 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              aria-label={content.nextLabel}
              disabled={currentIndex >= maxIndex}
              onClick={showNextReviews}
              className="flex size-11 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </div>
        ) : null}
      </div>

      {reviews.length > 0 ? (
        <div
          aria-live="polite"
          className="mt-8 grid grid-cols-2 gap-5"
        >
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              authorName={review.authorName}
              authorLocation={review.authorLocation ?? undefined}
              authorImageUrl={review.authorImageUrl ?? undefined}
              rating={review.rating}
              ratingLabel={content.ratingLabel}
              comment={review.comment}
              date={dateFormatter.format(new Date(review.createdAt))}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-black/8 bg-white px-6 py-10 text-center text-[14px] text-brand-ink/60">
          {content.emptyMessage}
        </p>
      )}
    </section>
  );
}
