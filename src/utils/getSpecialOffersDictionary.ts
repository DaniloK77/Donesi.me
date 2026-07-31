import "server-only";

import type { AboutFaqSectionProps } from "@/components/sections/homepage/AboutFaqSection";
import type { DealCategory, Lang } from "./getDictionary";

export type SpecialOffersHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  discountLabel: string;
  cityLabel: string;
  dailyLabel: string;
  ctaLabel: string;
  imageAlt: string;
};

export type WeeklyDealsContent = {
  eyebrow: string;
  title: string;
  description: string;
  scheduleTitle: string;
  scheduleDescription: string;
  dayTabsAriaLabel: string;
  days: Array<{
    short: string;
    long: string;
  }>;
  tableAriaLabel: string;
  restaurantColumn: string;
  dishColumn: string;
  categoryColumn: string;
  discountColumn: string;
  priceColumn: string;
  availabilityColumn: string;
  availableLabel: string;
  soldOutLabel: string;
  categoryFallback: string;
  filterAriaLabel: string;
  filterTabs: Array<{
    label: string;
    category: "ALL" | DealCategory;
  }>;
  sortLabel: string;
  sortDescendingLabel: string;
  sortAscendingLabel: string;
  openOfferLabel: string;
  noFilteredDeals: string;
  error: string;
  empty: string;
};

export type InviteFriendsContent = {
  eyebrow: string;
  title: string;
  description: string;
  friendBenefit: string;
  yourBenefit: string;
  codeLabel: string;
  code: string;
  copyLabel: string;
  copiedLabel: string;
  note: string;
  imageAlt: string;
};

export type SpecialOffersDictionary = {
  hero: SpecialOffersHeroContent;
  weeklyDeals: WeeklyDealsContent;
  invite: InviteFriendsContent;
  faq: Omit<AboutFaqSectionProps, "faqOnly">;
};

const dictionaries: Record<
  Lang,
  () => Promise<SpecialOffersDictionary>
> = {
  en: () =>
    import("@/data/pagesTextData/en/special-offers-page.json").then(
      (module) => module.default as SpecialOffersDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/special-offers-page.json").then(
      (module) => module.default as SpecialOffersDictionary,
    ),
};

export async function getSpecialOffersDictionary(lang: Lang) {
  return dictionaries[lang]();
}
