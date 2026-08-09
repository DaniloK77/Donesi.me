import Image from "next/image";
import { Clock3, Star, User } from "lucide-react";

export interface ReviewCardProps {
  authorName: string;
  authorLocation?: string;
  authorImageUrl?: string;
  rating: number;
  comment: string;
  date?: string;
}

interface ReviewCardInternalProps extends ReviewCardProps {
  ratingLabel: string;
}

export default function ReviewCard({
  authorName,
  authorLocation,
  authorImageUrl,
  rating,
  comment,
  date,
  ratingLabel,
}: ReviewCardInternalProps) {
  const normalizedRating = Math.min(5, Math.max(0, rating));

  return (
    <article className="min-h-56 rounded-xl border border-black/8 bg-white p-6 shadow-[0_10px_30px_rgba(3,8,31,0.06)]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-ink/8 text-brand-ink/45">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt=""
                fill
                unoptimized
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <User aria-hidden="true" className="size-6" />
            )}
          </div>

          <div className="min-w-0 border-l-2 border-brand pl-3">
            <h3 className="truncate text-[15px] font-semibold text-brand-ink">
              {authorName}
            </h3>
            {authorLocation ? (
              <p className="mt-0.5 truncate text-[12px] font-medium text-brand">
                {authorLocation}
              </p>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div
            aria-label={`${ratingLabel}: ${rating}/5`}
            className="flex justify-end gap-0.5"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={`size-4 ${
                  index < normalizedRating
                    ? "fill-brand text-brand"
                    : "fill-brand-ink/10 text-brand-ink/10"
                }`}
              />
            ))}
          </div>

          {date ? (
            <p className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-brand-ink/55">
              <Clock3 aria-hidden="true" className="size-3.5 text-brand" />
              {date}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-6 text-[13px] leading-6 text-brand-ink/72">
        {comment}
      </p>
    </article>
  );
}
