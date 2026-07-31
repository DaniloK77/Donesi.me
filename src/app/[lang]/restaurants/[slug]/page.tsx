import {
  DealsSection,
  Footer,
  Header,
  TopUtilityBar,
} from "@/components/sections/homepage";
import {
  CustomerReviewsSection,
  MenuList,
  RestaurantBanner,
  type RestaurantMenu,
} from "@/components/sections/restaurantmenu";
import {
  getDictionary,
  isSupportedLang,
} from "@/utils/getDictionary";
import { getInitialDeals } from "@/utils/getInitialDeals";
import { getRestaurantDictionary } from "@/utils/getRestaurantDictionary";
import { notFound } from "next/navigation";

type RestaurantMenuPageProps = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

async function getRestaurant(
  apiUrl: string,
  slug: string,
): Promise<RestaurantMenu | null> {
  try {
    const response = await fetch(
      `${apiUrl}/api/restaurants/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as RestaurantMenu;
  } catch {
    return null;
  }
}

export default async function RestaurantMenuPage({
  params,
}: RestaurantMenuPageProps) {
  const { lang, slug } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  const [
    sharedDictionary,
    restaurantDictionary,
    restaurant,
    initialDeals,
  ] =
    await Promise.all([
      getDictionary(lang),
      getRestaurantDictionary(lang),
      getRestaurant(apiUrl, slug),
      getInitialDeals(apiUrl),
    ]);
  const languagePath = `/restaurants/${restaurant?.slug ?? slug}`;

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/restaurants"
        languagePath={languagePath}
      />
      <main>
        {restaurant ? (
          <>
            <RestaurantBanner
              restaurant={restaurant}
              featuredItems={restaurant.featuredItems}
              lang={lang}
              content={restaurantDictionary.menuPage}
              categoryTranslations={sharedDictionary.categories.translations}
            />
            <MenuList
              categories={restaurant.menuCategories}
              lang={lang}
              title={restaurantDictionary.menuPage.menuTitle}
              categoryTranslations={sharedDictionary.categories.translations}
            />
            <CustomerReviewsSection
              reviews={restaurant.reviews ?? []}
              lang={lang}
              content={restaurantDictionary.reviews}
            />
          </>
        ) : (
          <section className="mx-auto flex min-h-96 w-[calc(100%-2rem)] max-w-382 flex-col items-center justify-center rounded-xl bg-brand-ink px-8 text-center text-white">
            <h1 className="text-[36px] font-semibold">
              {restaurantDictionary.menuPage.unavailableTitle}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-6 text-white/70">
              {restaurantDictionary.menuPage.unavailableMessage}
            </p>
          </section>
        )}
        <div className="mb-18">
          <DealsSection
            lang={lang}
            content={sharedDictionary.deals}
            initialDeals={initialDeals.deals}
            initialError={initialDeals.error}
            apiUrl={apiUrl}
          />
        </div>
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
