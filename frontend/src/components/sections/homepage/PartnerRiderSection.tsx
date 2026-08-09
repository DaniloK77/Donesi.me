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
    <article className="relative h-106.25 overflow-hidden rounded-xl bg-brand-ink">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="754px"
        className="object-cover"
      />

      {badge ? (
        <p className="absolute left-7 top-0 rounded-b-xl bg-white px-8 py-6 text-[16px] font-bold leading-6 text-brand-ink">
          {badge}
        </p>
      ) : null}

      <div className="absolute bottom-13 left-7 z-10 max-w-105">
        {eyebrow ? (
          <p className="text-[18px] font-medium leading-7 text-brand">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-1 text-[44px] font-bold leading-13 text-white">
          {title}
        </h2>

        {ctaLabel ? (
          <Link
            href={ctaHref || "#"}
            className="mt-7 inline-flex h-14.5 min-w-51 items-center justify-center rounded-[120px] bg-brand px-9 text-[18px] font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
      className="mx-auto mt-11 grid w-[calc(100%-2rem)] min-w-300 max-w-382 grid-cols-2 gap-5"
    >
      {cards.map((card) => (
        <PromoCard key={card.title} {...card} />
      ))}
    </section>
  );
}
