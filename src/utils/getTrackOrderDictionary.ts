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
  /** Step 4 — live courier map */
  delivery: {
    title: string;
    demoBadge: string;
    simulationNote: string;
    etaLabel: string;
    minutesShort: string;
    progressLabel: string;
    remainingLabel: string;
    arrivedTitle: string;
    arrivedNote: string;
    courierTitle: string;
    callLabel: string;
    pauseLabel: string;
    resumeLabel: string;
    replayLabel: string;
    speedLabel: string;
    mapUnavailable: string;
    vehicleLabels: {
      SCOOTER: string;
      BICYCLE: string;
      CAR: string;
    };
    markers: {
      pickup: string;
      dropoff: string;
      courier: string;
    };
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
