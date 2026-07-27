"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import type { HeaderContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type HeaderProps = Omit<HomepageSectionProps, "content"> & {
  content: HeaderContent;
};

export default function Header({ content, lang }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-40 mx-auto mb-[41px] mt-5 w-[calc(100%-2rem)] max-w-[1528px] lg:mt-[38px]">
      <div className="flex min-h-[53px] items-center justify-between gap-4 min-[1400px]:min-h-[61px] min-[1400px]:justify-start min-[1400px]:gap-0">
        <Link
          href={`/${lang}`}
          aria-label={content.logoAlt}
          className="flex h-[42px] w-[170px] shrink-0 items-center transition-opacity hover:opacity-80 min-[1400px]:h-[53px] min-[1400px]:w-[215px]"
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
          className="hidden min-w-0 items-center gap-1 min-[1400px]:ml-[168px] min-[1400px]:flex"
        >
          {content.navItems.map((item, index) => {
            const isActive = index === 0;

            return (
              <Link
                key={item.path}
                href={`/${lang}${item.path}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-[45px] items-center justify-center whitespace-nowrap rounded-[120px] text-[18px] font-medium transition-colors ${
                  isActive
                    ? "w-[127px] bg-brand text-white hover:bg-brand-hover"
                    : "px-5 text-brand-ink hover:text-brand-hover"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 min-[1400px]:ml-auto">
          <Link
            href={`/${lang}/login`}
            className="hidden h-[61px] items-center justify-center gap-2 whitespace-nowrap rounded-[120px] bg-brand-ink text-[18px] font-medium text-white transition-colors hover:bg-brand-hover md:flex min-[1400px]:w-[234px]"
          >
            <User
              aria-hidden="true"
              className="h-[27px] w-[31px] shrink-0"
            />
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
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] rounded-[12px] border border-black/10 bg-white p-3 shadow-xl min-[1400px]:hidden"
        >
          <div className="flex flex-col gap-1">
            {content.navItems.map((item, index) => (
              <Link
                key={item.path}
                href={`/${lang}${item.path}`}
                aria-current={index === 0 ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-[12px] px-4 py-3 text-[15px] font-medium transition-colors ${
                  index === 0
                    ? "bg-brand text-white"
                    : "text-brand-ink hover:text-brand-hover"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${lang}/login`}
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-[12px] bg-brand-ink px-4 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover md:hidden"
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
