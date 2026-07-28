import Image from "next/image";
import {
  Bike,
  ClipboardCheck,
  Clock3,
  Star,
  type LucideIcon,
} from "lucide-react";
import type {
  RestaurantHeroContent,
  RestaurantInfo,
  RestaurantRating,
} from "@/utils/getRestaurantDictionary";

export type RestaurantHeroSectionProps = RestaurantHeroContent;

type InfoPillProps = {
  icon: LucideIcon;
  info: RestaurantInfo;
};

function InfoPill({ icon: Icon, info }: InfoPillProps) {
  return (
    <div className="flex min-h-11 items-center gap-2.5 rounded-full border border-white/80 px-4 py-2 text-white sm:min-h-12 sm:px-5">
      <Icon aria-hidden="true" className="size-5 shrink-0 sm:size-6" />
      <p className="text-[12px] font-semibold leading-5 sm:text-[14px]">
        {info.label}: <span className="whitespace-nowrap">{info.value}</span>
      </p>
    </div>
  );
}

function RatingBadge({ rating }: { rating: RestaurantRating }) {
  const safeRating = Math.min(5, Math.max(0, rating.value));

  return (
    <div
      aria-label={rating.ariaLabel}
      className="flex h-32 w-28 flex-col justify-center rounded-xl bg-white px-3 text-brand-ink shadow-[0_12px_32px_rgba(3,8,31,0.22)] sm:h-39.5 sm:w-34"
    >
      <p className="text-[36px] font-medium leading-none sm:text-[48px]">
        {rating.value.toFixed(1)}
      </p>
      <div aria-hidden="true" className="mt-2 flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(1, Math.max(0, safeRating - index)) * 100;

          return (
            <span key={index} className="relative size-4">
              <Star className="absolute inset-0 size-4 fill-black/15 text-black/15" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                <Star className="size-4 fill-[#FFB800] text-[#FFB800]" />
              </span>
            </span>
          );
        })}
      </div>
      <p className="mt-1 whitespace-nowrap text-[9px] text-brand-ink/55 sm:text-[11px]">
        {rating.reviewCount}
      </p>
    </div>
  );
}

export default function RestaurantHeroSection({
  ariaLabel,
  imageUrl,
  imageAlt,
  name,
  eyebrow,
  minimumOrder,
  deliveryEstimate,
  openUntil,
  featuredImageUrl,
  featuredImageAlt = "",
  rating,
}: RestaurantHeroSectionProps) {
  const hasInfo = Boolean(minimumOrder || deliveryEstimate);

  return (
    <section
      aria-label={ariaLabel}
      className="relative mx-auto min-h-119.25 w-[calc(100%-2rem)] max-w-382 overflow-hidden rounded-xl bg-brand-ink"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 1536px) calc(100vw - 2rem), 1528px"
        className="object-cover object-center"
      />

      <div
        className={`relative z-10 flex min-h-119.25 flex-col justify-center px-6 pb-24 pt-14 sm:px-10 lg:px-14 ${
          featuredImageUrl ? "xl:max-w-[58%]" : "max-w-4xl"
        }`}
      >
        {eyebrow ? (
          <p className="text-[14px] font-normal leading-6 text-white sm:text-[16px]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[54px]">
          {name}
        </h1>

        {hasInfo ? (
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
            {minimumOrder ? (
              <InfoPill icon={ClipboardCheck} info={minimumOrder} />
            ) : null}
            {deliveryEstimate ? (
              <InfoPill icon={Bike} info={deliveryEstimate} />
            ) : null}
          </div>
        ) : null}
      </div>

      {featuredImageUrl ? (
        <div className="absolute bottom-9 right-10 top-9 z-10 hidden w-[38%] max-w-145.25 overflow-visible xl:block">
          <div className="relative size-full overflow-hidden rounded-xl">
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              fill
              sizes="581px"
              className="object-cover"
            />
          </div>
          {rating ? (
            <div className="absolute -bottom-2 -left-9 z-20">
              <RatingBadge rating={rating} />
            </div>
          ) : null}
        </div>
      ) : rating ? (
        <div className="absolute bottom-5 right-5 z-20 hidden sm:block">
          <RatingBadge rating={rating} />
        </div>
      ) : null}

      {openUntil ? (
        <div className="absolute bottom-0 left-0 z-20 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-t-xl bg-brand px-6 text-white sm:w-auto sm:min-w-84 sm:justify-start sm:rounded-bl-xl sm:rounded-tr-xl">
          <Clock3 aria-hidden="true" className="size-5 shrink-0 fill-white" />
          <p className="text-[13px] font-semibold sm:text-[16px]">
            {openUntil}
          </p>
        </div>
      ) : null}
    </section>
  );
}
