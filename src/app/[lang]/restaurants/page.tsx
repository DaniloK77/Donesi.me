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
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
