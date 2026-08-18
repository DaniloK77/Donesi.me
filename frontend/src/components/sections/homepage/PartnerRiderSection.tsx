import Image from "next/image";
import Link from "next/link";

export interface PromoCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  badge?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface PartnerRiderSectionProps {
  ariaLabel: string;
  cards: readonly PromoCardProps[];
}

export function PromoCard({
  imageUrl,
  imageAlt,
  title,
  badge = "",
  eyebrow = "",
  ctaLabel = "",
  ctaHref = "#",
}: PromoCardProps) {
  return (
    <article className="relative h-72 overflow-hidden rounded-xl bg-brand-ink sm:h-88 lg:h-106.25">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="754px"
        className="object-cover"
      />

      {badge ? (
        <p className="absolute left-4 top-0 max-w-[calc(100%-2rem)] rounded-b-xl bg-white px-4 py-4 text-[14px] font-bold leading-5 text-brand-ink sm:left-7 sm:px-8 sm:py-6 sm:text-[16px] sm:leading-6">
          {badge}
        </p>
      ) : null}

      <div className="absolute bottom-6 left-4 right-4 z-10 max-w-105 sm:bottom-13 sm:left-7 sm:right-auto">
        {eyebrow ? (
          <p className="text-[18px] font-medium leading-7 text-brand">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-1 text-[26px] font-bold leading-8 text-white sm:text-[34px] sm:leading-10 lg:text-[44px] lg:leading-13">
          {title}
        </h2>

        {ctaLabel ? (
          <Link
            href={ctaHref || "#"}
            className="mt-4 inline-flex h-12 min-w-0 items-center justify-center rounded-[120px] bg-brand px-6 text-[15px] font-medium text-white sm:mt-7 sm:h-14.5 sm:min-w-51 sm:px-9 sm:text-[18px] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function PartnerRiderSection({
  ariaLabel,
  cards,
}: PartnerRiderSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="mx-auto mt-11 grid w-[calc(100%-2rem)] max-w-382 grid-cols-1 gap-5 md:grid-cols-2"
    >
      {cards.map((card) => (
        <PromoCard key={card.title} {...card} />
      ))}
    </section>
  );
}
