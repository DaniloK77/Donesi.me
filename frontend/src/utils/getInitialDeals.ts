import "server-only";

import type { Deal } from "@/components/sections/homepage/DealsSection";

const defaultDealsCategory = "PIZZA_FASTFOOD";

export async function getInitialDeals(apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/api/deals`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Deals request failed with ${response.status}`);
    }

    const deals = (await response.json()) as Deal[];

    return {
      deals: deals.filter(
        (deal) => deal.category === defaultDealsCategory,
      ),
      error: false,
    };
  } catch {
    return {
      deals: [] as Deal[],
      error: true,
    };
  }
}
