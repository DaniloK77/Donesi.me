import Image from "next/image";
import type { HeroContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type HeroProps = Omit<HomepageSectionProps, "content"> & {
  content: HeroContent;
};

const statusCardPositions = [
  "right-[16px] top-[58px]",
  "right-0 top-[220px]",
  "right-[72px] top-[382px]",
] as const;

export default function Hero({ content }: HeroProps) {
  return (
    <section
      data-testid="hero-section"
      className="relative mx-auto h-152.5 w-[calc(100%-2rem)] min-w-300 max-w-382 overflow-hidden rounded-xl border border-black/20 bg-brand-hero"
    >
      <div
        data-testid="hero-copy"
        className="absolute left-14.25 top-32 z-40 w-130"
      >
        <p className="text-[16px] font-normal leading-6 text-brand-ink">
          {content.eyebrow}
        </p>

        <h1 className="mt-5.5 text-[54px] font-semibold leading-16.5 tracking-[-1.08px]">
          <span className="block text-brand-ink">{content.titleLineOne}</span>
          <span className="block text-brand">{content.titleLineTwo}</span>
        </h1>

        <div data-testid="hero-search" className="mt-6">
          <label
            htmlFor="hero-delivery-address"
            className="block text-[13px] font-normal leading-5 text-brand-ink"
          >
            {content.searchLabel}
          </label>
          <div className="relative mt-3 h-14.25 w-93.25">
            <input
              id="hero-delivery-address"
              type="text"
              placeholder={content.searchPlaceholder}
              className="h-14.25 w-full rounded-[120px] border border-black/40 bg-white pl-7 pr-49 text-[15px] text-brand-ink outline-none placeholder:text-black/60 focus:border-brand"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-14.25 w-47 rounded-[120px] bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {content.searchButton}
            </button>
          </div>
        </div>
      </div>

      <div
        data-testid="hero-visual"
        className="absolute bottom-0 right-0 h-134.25 w-201.25"
      >
        <div
          data-testid="hero-blob"
          className="absolute bottom-0 right-0 z-0 h-141.25 w-156.5"
        >
          <Image
            src="/images/hero/hero-blob-bg.png"
            alt={content.blobImageAlt}
            fill
            sizes="626px"
            className="object-fill"
          />
        </div>

        <div
          data-testid="hero-secondary-scene"
          className="absolute bottom-0 right-38 z-10 h-113.75 w-94.25 overflow-hidden rounded-t-xl"
        >
          <Image
            src="/images/hero/hero-secondary-scene.png"
            alt={content.secondaryImageAlt}
            fill
            sizes="377px"
            className="object-cover object-center"
          />
        </div>

        <div
          data-testid="hero-main-person"
          className="absolute -left-70 bottom-0 z-20 h-134.25 w-201.25"
        >
          <Image
            src="/images/hero/hero-main-person.png"
            alt={content.mainImageAlt}
            fill
            sizes="805px"
            priority
            className="object-contain object-bottom-left"
          />
        </div>

        {content.statusCards.map((card, index) => (
          <div
            key={card.title}
            className={`absolute z-30 ${statusCardPositions[index]}`}
          >
            <span
              data-testid={`hero-status-watermark-${index + 1}`}
              aria-hidden="true"
              className="absolute -right-2 -top-13.5 z-0 text-[68px] font-semibold leading-none text-brand-ink/10"
            >
              {index + 1}
            </span>
            <article
              data-testid={`hero-status-card-${index + 1}`}
              className="relative z-10 h-29 w-70 rounded-xl bg-white px-4.5 py-3.5 shadow-[0_10px_30px_rgba(3,8,31,0.14)]"
            >
              <div className="flex items-center justify-between gap-3">
                <Image
                  src="/brand/donesi-me-logo.png"
                  alt={card.brand}
                  width={72}
                  height={18}
                  className="h-4.5 w-18 object-contain"
                />
                <span className="text-[10px] font-normal text-brand-ink/50">
                  {card.time}
                </span>
              </div>
              <h2 className="mt-2.5 text-[13px] font-semibold leading-4.5 text-brand-ink">
                {card.title}
              </h2>
              <p className="mt-0.5 text-[11px] font-normal leading-4 text-brand-ink/70">
                {card.description}
              </p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
