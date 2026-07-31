import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth";
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

type LoginPageProps = {
  params: Promise<{ lang: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function LoginPage({ params }: LoginPageProps) {
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
        activePath="/login"
        languagePath="/login"
      />
      <main className="pb-20">
        <AuthForm mode="login" lang={lang} content={authDictionary.login} />
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
