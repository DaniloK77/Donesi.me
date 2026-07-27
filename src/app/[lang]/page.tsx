import { notFound } from "next/navigation";
import {
  AboutFaqSection,
  AppPromoSection,
  CategoriesSection,
  DealsSection,
  Footer,
  Header,
  Hero,
  PartnerRiderSection,
  PopularRestaurantsSection,
  StatsSection,
  TopUtilityBar,
} from "@/components/sections/homepage";
import {
  getDictionary,
  isSupportedLang,
  supportedLanguages,
} from "@/utils/getDictionary";
import type { Deal } from "@/components/sections/homepage/DealsSection";
import type { Category } from "@/components/sections/homepage/CategoriesSection";
import type { PopularRestaurant } from "@/components/sections/homepage/PopularRestaurantsSection";

type HomePageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

const defaultDealsCategory = "PIZZA_FASTFOOD";

async function getInitialDeals(apiUrl: string) {
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

async function getCategories(apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/api/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Categories request failed with ${response.status}`);
    }

    return {
      categories: (await response.json()) as Category[],
      error: false,
    };
  } catch {
    return {
      categories: [] as Category[],
      error: true,
    };
  }
}

async function getPopularRestaurants(apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/api/popular-restaurants`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Popular restaurants request failed with ${response.status}`,
      );
    }

    return {
      restaurants: (await response.json()) as PopularRestaurant[],
      error: false,
    };
  } catch {
    return {
      restaurants: [] as PopularRestaurant[],
      error: true,
    };
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const [initialDeals, initialCategories, initialPopularRestaurants] =
    await Promise.all([
      getInitialDeals(apiUrl),
      getCategories(apiUrl),
      getPopularRestaurants(apiUrl),
    ]);

  return (
    <>
      <TopUtilityBar lang={lang} content={dictionary.topBar} />
      <Header lang={lang} content={dictionary.header} />
      <main>
        <Hero lang={lang} content={dictionary.hero} />
        <DealsSection
          lang={lang}
          content={dictionary.deals}
          initialDeals={initialDeals.deals}
          initialError={initialDeals.error}
          apiUrl={apiUrl}
        />
        <CategoriesSection
          lang={lang}
          content={dictionary.categories}
          categories={initialCategories.categories}
          hasError={initialCategories.error}
        />
        <PopularRestaurantsSection
          lang={lang}
          content={dictionary.popularRestaurants}
          restaurants={initialPopularRestaurants.restaurants}
          hasError={initialPopularRestaurants.error}
        />
        <AppPromoSection
          {...dictionary.appPromo}
          subtitle={dictionary.appPromo.subtitle ?? undefined}
          appStoreUrl={dictionary.appPromo.appStoreUrl ?? undefined}
          googlePlayUrl={dictionary.appPromo.googlePlayUrl ?? undefined}
        />
        <PartnerRiderSection
          ariaLabel={dictionary.partnerRider.ariaLabel}
          cards={dictionary.partnerRider.cards.map((card) => ({
            imageUrl: card.imageUrl,
            imageAlt: card.imageAlt,
            title: card.title,
            badge: card.badge ?? undefined,
            eyebrow: card.eyebrow ?? undefined,
            ctaLabel: card.ctaLabel ?? undefined,
            ctaHref: card.ctaHref ?? undefined,
          }))}
        />
        <AboutFaqSection {...dictionary.aboutFaq} />
        <StatsSection lang={lang} content={dictionary.stats} />
      </main>
      <Footer lang={lang} content={dictionary.footer} />
    </>
  );
}
