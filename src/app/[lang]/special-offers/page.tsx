import { notFound } from "next/navigation";

import { DeliveryPopup } from "@/components/delivery";
import {
  AboutFaqSection,
  AppPromoSection,
  Footer,
  Header,
  TopUtilityBar,
} from "@/components/sections/homepage";
import {
  AllWeeklyDealsSection,
  InviteFriendsSection,
  SpecialOffersHero,
  type WeeklyDealsGroup,
} from "@/components/sections/specialoffers";
import {
  getDictionary,
  isSupportedLang,
  supportedLanguages,
} from "@/utils/getDictionary";
import { getSpecialOffersDictionary } from "@/utils/getSpecialOffersDictionary";

type SpecialOffersPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

async function getWeeklyDeals(apiUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/api/deals/weekly`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Weekly deals request failed with ${response.status}`);
    }

    return {
      deals: (await response.json()) as WeeklyDealsGroup[],
      error: false,
    };
  } catch {
    return {
      deals: [] as WeeklyDealsGroup[],
      error: true,
    };
  }
}

export default async function SpecialOffersPage({
  params,
}: SpecialOffersPageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const [sharedDictionary, specialOffersDictionary, weeklyDeals] =
    await Promise.all([
      getDictionary(lang),
      getSpecialOffersDictionary(lang),
      getWeeklyDeals(apiUrl),
    ]);

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/special-offers"
        languagePath="/special-offers"
      />
      <main className="overflow-hidden">
        <SpecialOffersHero content={specialOffersDictionary.hero} />
        <AllWeeklyDealsSection
          lang={lang}
          content={specialOffersDictionary.weeklyDeals}
          deals={weeklyDeals.deals}
          hasError={weeklyDeals.error}
        />
        <InviteFriendsSection content={specialOffersDictionary.invite} />
        <AppPromoSection
          {...sharedDictionary.appPromo}
          subtitle={sharedDictionary.appPromo.subtitle ?? undefined}
          appStoreUrl={sharedDictionary.appPromo.appStoreUrl ?? undefined}
          googlePlayUrl={
            sharedDictionary.appPromo.googlePlayUrl ?? undefined
          }
        />
        <AboutFaqSection
          {...specialOffersDictionary.faq}
          faqOnly
          fullBleed
        />
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} flushTop />
      <DeliveryPopup />
    </>
  );
}
