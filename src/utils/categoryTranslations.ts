import type { DealCategory } from "./getDictionary";

export type CategoryTranslations = Record<string, string>;

export function translateCategory(
  category: string,
  translations: CategoryTranslations,
) {
  return translations[category] ?? category;
}

export function getRestaurantDealCategory(category: string): DealCategory {
  const normalizedCategory = category.toLocaleLowerCase("sr-Latn");

  if (
    normalizedCategory.includes("zdrava") ||
    normalizedCategory.includes("bowl") ||
    normalizedCategory.includes("vegan")
  ) {
    return "VEGAN";
  }

  if (normalizedCategory.includes("sushi")) {
    return "SUSHI";
  }

  if (
    normalizedCategory.includes("burger") ||
    normalizedCategory.includes("fast food") ||
    normalizedCategory.includes("roštilj") ||
    normalizedCategory.includes("giros") ||
    normalizedCategory.includes("gyros") ||
    normalizedCategory.includes("pizza") ||
    normalizedCategory.includes("pica")
  ) {
    return "PIZZA_FASTFOOD";
  }

  return "OTHER";
}
