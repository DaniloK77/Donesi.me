import { notFound } from "next/navigation";

import { ProtectedRoute } from "@/components/auth";
import { TrackOrderPanel } from "@/components/orders";
import {
  Footer,
  Header,
  TopUtilityBar,
} from "@/components/sections/homepage";
import {
  getDictionary,
  isSupportedLang,
  supportedLanguages,
} from "@/utils/getDictionary";
import { getTrackOrderDictionary } from "@/utils/getTrackOrderDictionary";

type TrackOrderPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function TrackOrderPage({
  params,
}: TrackOrderPageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const [sharedDictionary, trackOrderDictionary] = await Promise.all([
    getDictionary(lang),
    getTrackOrderDictionary(lang),
  ]);

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/track-order"
        languagePath="/track-order"
      />
      <main className="min-h-[50vh] py-10 sm:py-16">
        <div className="mx-auto mb-8 w-[calc(100%-2rem)] max-w-382">
          <h1 className="text-4xl font-bold text-brand-ink">
            {trackOrderDictionary.title}
          </h1>
          <p className="mt-4 text-base text-brand-ink/65">
            {trackOrderDictionary.description}
          </p>
        </div>

        <ProtectedRoute
          lang={lang}
          loadingLabel={trackOrderDictionary.loadingLabel}
        >
          <TrackOrderPanel lang={lang} content={trackOrderDictionary} />
        </ProtectedRoute>
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
