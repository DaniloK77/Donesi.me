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

type HomePageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <>
      <TopUtilityBar lang={lang} content={dictionary.topBar} />
      <Header lang={lang} content={dictionary.header} />
      <main>
        <Hero lang={lang} content={dictionary.hero} />
        <DealsSection lang={lang} content={dictionary.deals} />
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
