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
      className="relative mx-auto h-[610px] w-[calc(100%-2rem)] min-w-[1200px] max-w-[1528px] overflow-hidden rounded-[12px] border border-black/20 bg-brand-hero"
    >
      <div
        data-testid="hero-copy"
        className="absolute left-[57px] top-[128px] z-40 w-[520px]"
      >
        <p className="text-[16px] font-normal leading-[24px] text-brand-ink">
          {content.eyebrow}
        </p>

        <h1 className="mt-[22px] text-[54px] font-semibold leading-[66px] tracking-[-1.08px]">
          <span className="block text-brand-ink">{content.titleLineOne}</span>
          <span className="block text-brand">{content.titleLineTwo}</span>
        </h1>

        <div data-testid="hero-search" className="mt-[24px]">
          <label
            htmlFor="hero-delivery-address"
            className="block text-[13px] font-normal leading-[20px] text-brand-ink"
          >
            {content.searchLabel}
          </label>
          <div className="relative mt-[12px] h-[57px] w-[373px]">
            <input
              id="hero-delivery-address"
              type="text"
              placeholder={content.searchPlaceholder}
              className="h-[57px] w-full rounded-[120px] border border-black/40 bg-white pl-[28px] pr-[196px] text-[15px] text-brand-ink outline-none placeholder:text-black/60 focus:border-brand"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-[57px] w-[188px] rounded-[120px] bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {content.searchButton}
            </button>
          </div>
        </div>
      </div>

      <div
        data-testid="hero-visual"
        className="absolute bottom-0 right-0 h-[537px] w-[805px]"
      >
        <div
          data-testid="hero-blob"
          className="absolute bottom-0 right-0 z-0 h-[565px] w-[626px]"
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
          className="absolute bottom-0 right-[152px] z-10 h-[455px] w-[377px] overflow-hidden rounded-t-[12px]"
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
          className="absolute bottom-0 left-[-280px] z-20 h-[537px] w-[805px]"
        >
          <Image
            src="/images/hero/hero-main-person.png"
            alt={content.mainImageAlt}
            fill
            sizes="805px"
            priority
            className="object-contain object-left-bottom"
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
              className="absolute -right-[8px] -top-[54px] z-0 text-[68px] font-semibold leading-none text-brand-ink/10"
            >
              {index + 1}
            </span>
            <article
              data-testid={`hero-status-card-${index + 1}`}
              className="relative z-10 h-[116px] w-[280px] rounded-[12px] bg-white px-[18px] py-[14px] shadow-[0_10px_30px_rgba(3,8,31,0.14)]"
            >
              <div className="flex items-center justify-between gap-3">
                <Image
                  src="/brand/donesi-me-logo.png"
                  alt={card.brand}
                  width={72}
                  height={18}
                  className="h-[18px] w-[72px] object-contain"
                />
                <span className="text-[10px] font-normal text-brand-ink/50">
                  {card.time}
                </span>
              </div>
              <h2 className="mt-[10px] text-[13px] font-semibold leading-[18px] text-brand-ink">
                {card.title}
              </h2>
              <p className="mt-[2px] text-[11px] font-normal leading-[16px] text-brand-ink/70">
                {card.description}
              </p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
