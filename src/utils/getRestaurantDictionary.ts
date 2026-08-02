import "server-only";

import type { Lang } from "./getDictionary";

export type RestaurantInfo = {
  label: string;
  value: string;
};

export type RestaurantRating = {
  value: number;
  reviewCount: string;
  ariaLabel: string;
};

export type RestaurantHeroContent = {
  ariaLabel: string;
  imageUrl: string;
  imageAlt: string;
  name: string;
  eyebrow?: string;
  minimumOrder?: RestaurantInfo;
  deliveryEstimate?: RestaurantInfo;
  openUntil?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  rating?: RestaurantRating;
};

export type FeaturedRestaurant = {
  id: string;
  name: string;
  logoUrl: string;
  slug: string;
};

export type FeaturedRestaurantsContent = {
  title: string;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  restaurants: FeaturedRestaurant[];
};

export type RestaurantDiscoveryContent = {
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  locationLabel: string;
  locationValue: string;
  categoryLabel: string;
  allCategoriesLabel: string;
  sortLabel: string;
  sortOptions: {
    featured: string;
    rating: string;
    delivery: string;
  };
  resultsLabel: string;
  resultLabel: string;
  noResultsTitle: string;
  noResultsMessage: string;
  ratingLabel: string;
  deliveryLabel: string;
};

export type RestaurantsMapContent = {
  title: string;
  description: string;
  ariaLabel: string;
  countLabel: string;
};

export type RestaurantScheduleDay = {
  label: string;
  hours: string;
};

export type RestaurantInformationContent = {
  ariaLabel: string;
  deliveryTitle: string;
  contactTitle: string;
  operationalTitle: string;
  estimatedDeliveryLabel: string;
  minutesLabel: string;
  contactDescription: string;
  phoneLabel: string;
  phoneNumber: string;
  websiteLabel: string;
  websiteDisplay: string;
  deliverySchedule: RestaurantScheduleDay[];
  operationalSchedule: RestaurantScheduleDay[];
};

export type RestaurantMenuPageContent = {
  selectedRestaurantLabel: string;
  featuredItemsTitle: string;
  featuredItemsAriaLabel: string;
  previousItemsLabel: string;
  nextItemsLabel: string;
  deliveryLabel: string;
  ratingLabel: string;
  menuTitle: string;
  unavailableTitle: string;
  unavailableMessage: string;
  itemImageFallback: string;
  customization: ItemCustomizationContent;
};

export type ItemCustomizationContent = {
  breadcrumbPrefix: string;
  breadcrumbCurrent: string;
  progressLabel: string;
  submitError: string;
  stepLabels: {
    addOns: string;
    cutlery: string;
    specialRequests: string;
  };
  addOns: {
    title: string;
    subtitle: string;
    selectedCount: string;
    selectedSuffix: string;
    freeLimitMessage: string;
    noAddOnsAvailable: string;
    noAddOnsHint: string;
    totalLabel: string;
    freeWithinLimitNote: string;
    takeMeBack: string;
    nextStep: string;
    limitReached: string;
  };
  cutlery: {
    title: string;
    subtitle: string;
    yes: string;
    no: string;
    helper: string;
    back: string;
    nextStep: string;
  };
  specialRequests: {
    title: string;
    subtitle: string;
    placeholder: string;
    characterCount: string;
    back: string;
    addToCart: string;
    optional: string;
  };
  summary: {
    menuItemLabel: string;
    addOnsLabel: string;
    cutleryLabel: string;
    specialRequestsLabel: string;
  };
};

export type CustomerReviewsContent = {
  title: string;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  emptyMessage: string;
  ratingLabel: string;
};

export type RestaurantPageDictionary = {
  hero: RestaurantHeroContent;
  featuredRestaurants: FeaturedRestaurantsContent;
  map: RestaurantsMapContent;
  discovery: RestaurantDiscoveryContent;
  information: RestaurantInformationContent;
  menuPage: RestaurantMenuPageContent;
  reviews: CustomerReviewsContent;
};

const dictionaries: Record<
  Lang,
  () => Promise<RestaurantPageDictionary>
> = {
  en: () =>
    import("@/data/pagesTextData/en/restaurant-page.json").then(
      (module) => module.default as RestaurantPageDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/restaurant-page.json").then(
      (module) => module.default as RestaurantPageDictionary,
    ),
};

export function getRestaurantDictionary(lang: Lang) {
  return dictionaries[lang]();
}
