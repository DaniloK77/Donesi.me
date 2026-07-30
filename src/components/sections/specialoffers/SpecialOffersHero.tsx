import Image from "next/image";
import Link from "next/link";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";

import type { SpecialOffersHeroProps } from "./types";

export default function SpecialOffersHero({
  content,
}: SpecialOffersHeroProps) {
  return (
    <section
      aria-labelledby="special-offers-hero-title"
      className="special-reveal mx-auto grid min-h-135 w-[calc(100%-2rem)] min-w-300 max-w-382 grid-cols-[1.02fr_0.98fr] overflow-hidden rounded-[32px] bg-brand-ink text-white shadow-[0_28px_80px_rgba(3,8,31,0.18)]"
    >
      <div className="relative flex flex-col justify-center overflow-hidden px-18 py-16">
        <div className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-44 right-6 size-96 rounded-full bg-brand-green/20 blur-3xl" />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand">
            <Sparkles aria-hidden="true" className="size-4" />
            {content.eyebrow}
          </p>

          <h1
            id="special-offers-hero-title"
            className="mt-7 max-w-180 text-[58px] font-bold leading-[1.08] tracking-[-0.035em]"
          >
            {content.title}
          </h1>

          <p className="mt-6 max-w-160 text-[18px] leading-8 text-white/72">
            {content.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand px-5 py-3 text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(252,138,6,0.28)]">
              {content.discountLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-[14px] font-semibold text-white/90">
              <MapPin aria-hidden="true" className="size-4 text-brand" />
              {content.cityLabel}
            </span>
            <span className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-[14px] font-semibold text-white/90">
              {content.dailyLabel}
            </span>
          </div>

          <Link
            href="#weekly-deals"
            className="mt-10 inline-flex h-14 w-fit items-center gap-3 rounded-full bg-white px-7 text-[15px] font-bold text-brand-ink transition duration-300 hover:-translate-y-1 hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {content.ctaLabel}
            <ArrowDown aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="relative min-h-135 overflow-hidden">
        <Image
          src="/images/special-offers/delivery-hero.jpg"
          alt={content.imageAlt}
          fill
          priority
          sizes="(min-width: 1400px) 730px, 50vw"
          className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-ink/75 to-transparent" />
        <div className="special-float absolute bottom-10 right-10 rounded-2xl border border-white/20 bg-brand-ink/80 px-6 py-5 shadow-2xl backdrop-blur-md">
          <p className="text-[13px] font-medium text-white/60">
            donesi.me
          </p>
          <p className="mt-1 text-[25px] font-bold text-white">
            {content.discountLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
