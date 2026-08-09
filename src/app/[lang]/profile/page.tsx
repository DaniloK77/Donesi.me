import { notFound } from "next/navigation";
import { ProfilePanel, ProtectedRoute } from "@/components/auth";
import {
  Footer,
  Header,
  TopUtilityBar,
} from "@/components/sections/homepage";
import { getAuthDictionary } from "@/utils/getAuthDictionary";
import {
  getDictionary,
  isSupportedLang,
  supportedLanguages,
} from "@/utils/getDictionary";

type ProfilePageProps = {
  params: Promise<{ lang: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = await params;

  if (!isSupportedLang(lang)) {
    notFound();
  }

  const [sharedDictionary, authDictionary] = await Promise.all([
    getDictionary(lang),
    getAuthDictionary(lang),
  ]);

  return (
    <>
      <TopUtilityBar lang={lang} content={sharedDictionary.topBar} />
      <Header
        lang={lang}
        content={sharedDictionary.header}
        activePath="/profile"
        languagePath="/profile"
      />
      <main className="pb-20">
        <ProtectedRoute
          lang={lang}
          loadingLabel={authDictionary.profile.loadingLabel}
        >
          <ProfilePanel lang={lang} content={authDictionary.profile} />
        </ProtectedRoute>
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
