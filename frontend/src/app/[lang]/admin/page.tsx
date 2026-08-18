import { notFound } from "next/navigation";

import { AdminPanel, AdminRoute } from "@/components/admin";
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
import { getAdminDictionary } from "@/utils/getAdminDictionary";
import { getTrackOrderDictionary } from "@/utils/getTrackOrderDictionary";

type AdminPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const [sharedDictionary, adminDictionary, trackOrderDictionary] =
    await Promise.all([
      getDictionary(lang),
      getAdminDictionary(lang),
      getTrackOrderDictionary(lang),
    ]);

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/admin"
        languagePath="/admin"
      />
      <main className="min-h-[50vh] py-10 sm:py-16">
        <div className="mx-auto mb-8 w-[calc(100%-2rem)] max-w-382">
          <h1 className="text-[28px] font-bold text-brand-ink sm:text-4xl">
            {adminDictionary.title}
          </h1>
          <p className="mt-4 hidden text-base text-brand-ink/65 sm:block">
            {adminDictionary.description}
          </p>
        </div>

        <AdminRoute lang={lang} content={adminDictionary}>
          <AdminPanel
            lang={lang}
            content={adminDictionary}
            deliveryContent={trackOrderDictionary.delivery}
          />
        </AdminRoute>
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
