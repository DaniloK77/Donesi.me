import "server-only";

export const supportedLanguages = ["me", "en"] as const;

export type Lang = (typeof supportedLanguages)[number];

export type TopUtilityBarContent = {
  ariaLabel: string;
  promoPrefix: string;
  promoCodeLabel: string;
  promoCode: string;
  location: string;
  changeLocation: string;
  items: string;
  price: string;
  locationIconAlt: string;
  cartIconAlt: string;
  downloadIconAlt: string;
};

export type HeaderNavItem = {
  label: string;
  path: string;
};

export type HeaderContent = {
  logoAlt: string;
  primaryNavigation: string;
  mobileNavigation: string;
  languageSwitcher: string;
  navItems: HeaderNavItem[];
  loginSignup: string;
  openMenu: string;
  closeMenu: string;
};

export type HeroStatusCard = {
  brand: string;
  time: string;
  title: string;
  description: string;
};

export type HeroContent = {
  eyebrow: string;
  titleLineOne: string;
  titleLineTwo: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchButton: string;
  mainImageAlt: string;
  secondaryImageAlt: string;
  blobImageAlt: string;
  statusCards: HeroStatusCard[];
};

export type DealCategory =
  | "VEGAN"
  | "SUSHI"
  | "PIZZA_FASTFOOD"
  | "OTHER";

export type DealsTab = {
  label: string;
  category: DealCategory;
};

export type DealsContent = {
  title: string;
  tabsAriaLabel: string;
  tabs: DealsTab[];
  loading: string;
  error: string;
  empty: string;
};

export type CategoriesContent = {
  title: string;
  restaurantsLabel: string;
  error: string;
  translations: Record<string, string>;
};

export type PopularRestaurantsContent = {
  title: string;
  error: string;
};

export type AppPromoContent = {
  ariaLabel: string;
  imageUrl: string;
  imageAlt: string;
  brandName: string;
  brandAccent: string;
  titlePrimary: string;
  titleAccent: string;
  titleSuffix: string;
  subtitle?: string | null;
  appStoreUrl?: string | null;
  googlePlayUrl?: string | null;
  showStoreBadges?: boolean;
  appStoreLabel: string;
  googlePlayLabel: string;
};

export type PartnerRiderCardContent = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  badge?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type PartnerRiderContent = {
  ariaLabel: string;
  cards: PartnerRiderCardContent[];
};

export type AboutFaqTabId =
  | "faq"
  | "about"
  | "partner"
  | "support";

export type AboutFaqContent = {
  title: string;
  tabsAriaLabel: string;
  tabs: Array<{
    id: AboutFaqTabId;
    label: string;
  }>;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  steps: Array<{
    iconUrl: string;
    title: string;
    description: string;
  }>;
  summaryText: string;
  placeholderText: string;
};

export type StatsContent = {
  ariaLabel: string;
  items: Array<{
    value: string;
    label: string;
  }>;
};

export type FooterContent = {
  logoAlt: string;
  storeBadgesAlt: string;
  companyText: string;
  newsletterTitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  subscribeLabel: string;
  privacyPrefix: string;
  privacyLabel: string;
  socialAriaLabel: string;
  socialLabels: string[];
  legalColumn: {
    title: string;
    items: string[];
  };
  linksColumn: {
    title: string;
    items: string[];
  };
  copyrightText: string;
  bottomLinks: string[];
};

export type HomePageDictionary = {
  topBar: TopUtilityBarContent;
  header: HeaderContent;
  hero: HeroContent;
  deals: DealsContent;
  categories: CategoriesContent;
  popularRestaurants: PopularRestaurantsContent;
  appPromo: AppPromoContent;
  partnerRider: PartnerRiderContent;
  aboutFaq: AboutFaqContent;
  stats: StatsContent;
  footer: FooterContent;
};

const dictionaries: Record<Lang, () => Promise<HomePageDictionary>> = {
  en: () =>
    import("@/data/pagesTextData/en/home-page.json").then(
      (module) => module.default as HomePageDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/home-page.json").then(
      (module) => module.default as HomePageDictionary,
    ),
};

export function isSupportedLang(lang: string): lang is Lang {
  return supportedLanguages.some((supportedLang) => supportedLang === lang);
}

export async function getDictionary(lang: Lang) {
  return dictionaries[lang]();
}
