import "server-only";

import type { Lang } from "./getDictionary";

export type TrackOrderDictionary = {
  title: string;
  description: string;
  loadingLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  genericErrorLabel: string;
  browseCta: string;
  orderLabel: string;
  placedOnLabel: string;
  addressLabel: string;
  itemsLabel: string;
  totalLabel: string;
  deliveryTypeLabels: {
    DELIVERY: string;
    PICKUP: string;
  };
  statusLabels: {
    PENDING: string;
    CONFIRMED: string;
    PREPARING: string;
    OUT_FOR_DELIVERY: string;
    OUT_FOR_PICKUP: string;
    DELIVERED: string;
    PICKED_UP: string;
    CANCELLED: string;
  };
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
