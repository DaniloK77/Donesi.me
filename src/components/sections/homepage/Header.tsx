"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import type { HeaderContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type HeaderProps = Omit<HomepageSectionProps, "content"> & {
  content: HeaderContent;
  activePath?: string;
  languagePath?: string;
};

export default function Header({
  content,
  lang,
  activePath = "",
  languagePath = "",
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-40 mx-auto mb-10.25 mt-5 w-[calc(100%-2rem)] max-w-382 lg:mt-9.5">
      <div className="flex min-h-13.25 items-center justify-between gap-4 min-[1400px]:min-h-15.25 min-[1400px]:justify-start min-[1400px]:gap-0">
        <Link
          href={`/${lang}`}
          aria-label={content.logoAlt}
          className="flex h-10.5 w-42.5 shrink-0 items-center transition-opacity hover:opacity-80 min-[1400px]:h-13.25 min-[1400px]:w-53.75"
        >
          <Image
            src="/brand/donesi-me-logo.png"
            alt={content.logoAlt}
            width={215}
            height={53}
            priority
            className="h-full w-full object-contain"
          />
        </Link>

        <nav
          aria-label={content.primaryNavigation}
          className="hidden min-w-0 items-center gap-1.5 min-[1400px]:ml-20 min-[1400px]:flex"
        >
          {content.navItems.map((item) => {
            const isActive = item.path === activePath;

            return (
              <Link
                key={item.path}
                href={`/${lang}${item.path}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11.25 items-center justify-center whitespace-nowrap rounded-[120px] text-[18px] font-medium transition-colors ${
                  isActive
                    ? "w-31.75 bg-brand text-white hover:bg-brand-hover"
                    : "px-5 text-brand-ink hover:text-brand-hover"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 min-[1400px]:ml-auto">
          <div
            role="group"
            aria-label={content.languageSwitcher}
            className="hidden h-12 items-center rounded-full border border-brand-ink/15 bg-white p-1 shadow-sm md:flex"
          >
            {(["en", "me"] as const).map((language) => {
              const isActive = lang === language;

              return (
                <Link
                  key={language}
                  href={`/${language}${languagePath}`}
                  lang={language}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`${content.languageSwitcher}: ${language.toUpperCase()}`}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-full px-2.5 text-sm font-semibold uppercase transition-colors ${
                    isActive
                      ? "bg-brand text-white"
                      : "text-brand-ink hover:bg-brand/10 hover:text-brand-hover"
                  }`}
                >
                  {language}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${lang}/login`}
            className="hidden h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-brand-ink px-6 text-[17px] font-medium text-white transition-colors hover:bg-brand-hover md:flex min-[1400px]:min-w-51"
          >
            <User aria-hidden="true" className="size-6 shrink-0" />
            <span>{content.loginSignup}</span>
          </Link>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? content.closeMenu : content.openMenu}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="flex size-12 items-center justify-center rounded-full bg-brand-ink text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[1400px]:hidden"
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-6" />
            ) : (
              <Menu aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label={content.mobileNavigation}
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] rounded-xl border border-black/10 bg-white p-3 shadow-xl min-[1400px]:hidden"
        >
          <div className="flex flex-col gap-1.5">
            {content.navItems.map((item) => (
              <Link
                key={item.path}
                href={`/${lang}${item.path}`}
                aria-current={item.path === activePath ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                  item.path === activePath
                    ? "bg-brand text-white"
                    : "text-brand-ink hover:text-brand-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div
              role="group"
              aria-label={content.languageSwitcher}
              className="mt-2 flex items-center rounded-xl bg-brand-ink/5 p-1 md:hidden"
            >
              {(["en", "me"] as const).map((language) => {
                const isActive = lang === language;

                return (
                  <Link
                    key={language}
                    href={`/${language}${languagePath}`}
                    lang={language}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`${content.languageSwitcher}: ${language.toUpperCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-semibold uppercase transition-colors ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-brand-ink hover:text-brand-hover"
                    }`}
                  >
                    {language}
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/${lang}/login`}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover md:hidden"
            >
              <User aria-hidden="true" className="size-5" />
              {content.loginSignup}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
