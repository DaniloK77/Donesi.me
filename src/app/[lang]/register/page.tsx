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

type RegisterPageProps = {
  params: Promise<{ lang: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function RegisterPage({ params }: RegisterPageProps) {
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
        activePath="/register"
        languagePath="/register"
      />
      <main className="pb-20">
        <AuthForm
          mode="register"
          lang={lang}
          content={authDictionary.register}
        />
      </main>
      <Footer lang={lang} content={sharedDictionary.footer} />
    </>
  );
}
