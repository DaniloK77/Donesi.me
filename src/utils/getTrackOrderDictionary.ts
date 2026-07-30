import "server-only";

import type { Lang } from "./getDictionary";

export type TrackOrderDictionary = {
  title: string;
  description: string;
};

const dictionaries: Record<Lang, () => Promise<TrackOrderDictionary>> = {
  en: () =>
    import("@/data/pagesTextData/en/track-order-page.json").then(
      (module) => module.default as TrackOrderDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/track-order-page.json").then(
      (module) => module.default as TrackOrderDictionary,
    ),
};

export async function getTrackOrderDictionary(lang: Lang) {
  return dictionaries[lang]();
}
