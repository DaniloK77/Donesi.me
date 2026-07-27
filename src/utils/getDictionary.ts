import "server-only";

export const supportedLanguages = ["me", "en"] as const;

export type Lang = (typeof supportedLanguages)[number];

export type HomePageDictionary = {
  topBar: Record<string, unknown>;
  header: Record<string, unknown>;
  hero: Record<string, unknown>;
  deals: Record<string, unknown>;
  categories: Record<string, unknown>;
  popularRestaurants: Record<string, unknown>;
  appPromo: Record<string, unknown>;
  partnerRider: Record<string, unknown>;
  aboutFaq: Record<string, unknown>;
  stats: Record<string, unknown>;
  footer: Record<string, unknown>;
};

const dictionaries: Record<Lang, () => Promise<HomePageDictionary>> = {
  en: () =>
    import("@/data/pagesTextData/en/home-page.json").then(
      (module) => module.default,
    ),
  me: () =>
    import("@/data/pagesTextData/me/home-page.json").then(
      (module) => module.default,
    ),
};

export function isSupportedLang(lang: string): lang is Lang {
  return supportedLanguages.some((supportedLang) => supportedLang === lang);
}

export async function getDictionary(lang: Lang) {
  return dictionaries[lang]();
}
