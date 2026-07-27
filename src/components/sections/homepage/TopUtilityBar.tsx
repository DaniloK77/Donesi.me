import Image from "next/image";
import type { TopUtilityBarContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type TopUtilityBarProps = Omit<HomepageSectionProps, "content"> & {
  content: TopUtilityBarContent;
};

export default function TopUtilityBar({ content }: TopUtilityBarProps) {
  return (
    <aside
      aria-label={content.ariaLabel}
      className="mx-auto hidden h-17.5 w-[calc(100%-2rem)] max-w-382 grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(320px,378px)] overflow-hidden rounded-b-xl border border-black/10 bg-brand-surface lg:grid"
    >
      <div className="flex min-w-0 items-center gap-2 px-5 text-[13px] font-medium text-brand-ink 2xl:px-9 2xl:text-[15px]">
        <span aria-hidden="true">🌟</span>
        <p className="truncate">
          {content.promoPrefix}{" "}
          <span className="font-bold text-brand">
            {content.promoCodeLabel} {content.promoCode}
          </span>
        </p>
      </div>

      <div className="flex min-w-0 items-center justify-center gap-3 px-4 text-[13px] font-medium text-brand-ink 2xl:text-[15px]">
        <Image
          src="/icons/location.svg"
          alt={content.locationIconAlt}
          width={25}
          height={25}
          className="size-6.25 shrink-0"
        />
        <span className="truncate">{content.location}</span>
        <a
          href="#location"
          className="shrink-0 text-[13px] text-brand underline underline-offset-2 transition-opacity hover:text-brand-hover hover:opacity-80 2xl:text-[14px]"
        >
          {content.changeLocation}
        </a>
      </div>

      <div className="grid h-full grid-cols-[64px_1fr_1fr_62px] items-center bg-brand-green text-white">
        <div className="flex h-full items-center justify-center">
          <Image
            src="/icons/full-shopping-basket.svg"
            alt={content.cartIconAlt}
            width={43}
            height={43}
            className="size-10.75"
          />
        </div>
        <span className="flex h-full items-center justify-center border-l border-white/20 px-3 text-[14px] font-semibold xl:text-[16px]">
          {content.items}
        </span>
        <span className="flex h-full items-center justify-center border-l border-white/20 px-3 text-[14px] font-semibold xl:text-[16px]">
          {content.price}
        </span>
        <a
          href="#download-app"
          aria-label={content.downloadIconAlt}
          className="mx-auto flex size-11 items-center justify-center rounded-full border-l border-white/20 bg-brand-green transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image
            src="/icons/forward-button.svg"
            alt=""
            width={38}
            height={38}
            className="size-9.5"
          />
        </a>
      </div>
    </aside>
  );
}
