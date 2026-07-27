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

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const initialDeals = await getInitialDeals(apiUrl);

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
        <CategoriesSection lang={lang} content={dictionary.categories} />
        <PopularRestaurantsSection
          lang={lang}
          content={dictionary.popularRestaurants}
        />
        <AppPromoSection lang={lang} content={dictionary.appPromo} />
        <PartnerRiderSection lang={lang} content={dictionary.partnerRider} />
        <AboutFaqSection lang={lang} content={dictionary.aboutFaq} />
        <StatsSection lang={lang} content={dictionary.stats} />
      </main>
      <Footer lang={lang} content={dictionary.footer} />
    </>
  );
}
