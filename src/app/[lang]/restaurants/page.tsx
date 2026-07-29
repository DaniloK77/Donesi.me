import { notFound } from "next/navigation";
import {
  Footer,
  Header,
  TopUtilityBar,
} from "@/components/sections/homepage";
import {
  FeaturedRestaurantsSection,
  RestaurantDiscoverySection,
  RestaurantHeroSection,
  RestaurantInformationSection,
  RestaurantsMap,
  type RestaurantSummary,
} from "@/components/sections/restaurantpage";
import {
  getDictionary,
  isSupportedLang,
  supportedLanguages,
} from "@/utils/getDictionary";
import { getRestaurantDictionary } from "@/utils/getRestaurantDictionary";

type RestaurantsPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

async function getRestaurants(apiUrl: string): Promise<RestaurantSummary[]> {
  try {
    const response = await fetch(`${apiUrl}/api/restaurants`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as RestaurantSummary[];
  } catch {
    return [];
  }
}

export default async function RestaurantsPage({
  params,
}: RestaurantsPageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const [sharedDictionary, restaurantDictionary, restaurants] =
    await Promise.all([
      getDictionary(lang),
      getRestaurantDictionary(lang),
      getRestaurants(apiUrl),
    ]);
  const defaultRestaurant =
    restaurants.find((restaurant) => restaurant.slug === "burger-king") ??
    restaurants[0];

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/restaurants"
        languagePath="/restaurants"
      />
      <main>
        <RestaurantHeroSection {...restaurantDictionary.hero} />
        <FeaturedRestaurantsSection
          lang={lang}
          content={restaurantDictionary.featuredRestaurants}
        />
        <RestaurantDiscoverySection
          lang={lang}
          content={restaurantDictionary.discovery}
          restaurants={restaurants}
        />
        <section
          aria-label={restaurantDictionary.map.ariaLabel}
          className="mx-auto mt-20 w-[calc(100%-2rem)] max-w-382"
        >
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="text-[36px] font-bold leading-tight text-brand-ink">
                {restaurantDictionary.map.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-brand-ink/65">
                {restaurantDictionary.map.description}
              </p>
            </div>
            <span className="rounded-full bg-brand/10 px-4 py-2 text-[13px] font-semibold text-brand">
              {restaurants.length} {restaurantDictionary.map.countLabel}
            </span>
          </div>

          <div className="mt-8 h-130 overflow-hidden rounded-3xl border border-black/10 bg-brand-surface shadow-[0_20px_60px_rgba(3,8,31,0.12)]">
            <RestaurantsMap restaurants={restaurants} />
          </div>
        </section>
        <RestaurantInformationSection
          restaurantName={defaultRestaurant?.name ?? "Burger King"}
          deliveryTimeMin={defaultRestaurant?.deliveryTimeMin ?? 25}
          content={restaurantDictionary.information}
        />
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
