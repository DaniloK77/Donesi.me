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
      className="special-reveal mx-auto grid w-[calc(100%-2rem)] max-w-382 grid-cols-1 overflow-hidden rounded-[24px] bg-brand-ink text-white shadow-[0_28px_80px_rgba(3,8,31,0.18)] sm:rounded-[32px] lg:min-h-135 lg:grid-cols-[1.02fr_0.98fr]"
    >
      <div className="relative flex flex-col justify-center overflow-hidden px-5 py-10 sm:px-10 sm:py-14 lg:px-18 lg:py-16">
        <div className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-44 right-6 size-96 rounded-full bg-brand-green/20 blur-3xl" />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand sm:px-4 sm:text-[13px] sm:tracking-[0.16em]">
            <Sparkles aria-hidden="true" className="size-4" />
            {content.eyebrow}
          </p>

          <h1
            id="special-offers-hero-title"
            className="mt-6 max-w-180 text-[30px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[42px] lg:mt-7 lg:text-[58px] lg:leading-[1.08] lg:tracking-[-0.035em]"
          >
            {content.title}
          </h1>

          <p className="mt-5 max-w-160 text-[15px] leading-7 text-white/72 sm:text-[18px] sm:leading-8">
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
            className="mt-8 inline-flex h-13 w-fit items-center gap-3 rounded-full bg-white px-6 sm:h-14 sm:px-7 lg:mt-10 text-[15px] font-bold text-brand-ink transition duration-300 hover:-translate-y-1 hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {content.ctaLabel}
            <ArrowDown aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="relative order-first h-56 overflow-hidden sm:h-72 lg:order-none lg:h-auto lg:min-h-135">
        <Image
          src="/images/special-offers/delivery-hero.jpg"
          alt={content.imageAlt}
          fill
          priority
          sizes="(min-width: 1400px) 730px, 50vw"
          className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/15 to-transparent lg:bg-gradient-to-r" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-ink/75 to-transparent" />
        <div className="special-float absolute bottom-4 right-4 rounded-2xl border border-white/20 bg-brand-ink/80 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6 sm:py-5 lg:bottom-10 lg:right-10">
          <p className="text-[13px] font-medium text-white/60">
            donesi.me
          </p>
          <p className="mt-1 text-[19px] font-bold text-white sm:text-[25px]">
            {content.discountLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
