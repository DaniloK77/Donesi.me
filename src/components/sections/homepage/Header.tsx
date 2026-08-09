"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const userInitials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    window.location.assign(`/${lang}`);
  };

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
                    ? "min-w-31.75 bg-brand px-5 text-white hover:bg-brand-hover"
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

          {status === "authenticated" && user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-label={content.userMenuLabel}
                aria-expanded={isUserMenuOpen}
                aria-controls="desktop-user-menu"
                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                className="flex h-12 min-w-51 items-center gap-2.5 rounded-full bg-brand-ink px-3 pr-5 text-left text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold">
                  {userInitials || <User aria-hidden="true" className="size-5" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">
                  {user.name}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 shrink-0 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isUserMenuOpen ? (
                <div
                  id="desktop-user-menu"
                  className="absolute right-0 top-[calc(100%+0.6rem)] w-60 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white p-2 shadow-[0_18px_50px_rgba(3,8,31,0.18)]"
                >
                  <div className="border-b border-brand-ink/8 px-3 py-3">
                    <p className="truncate text-[13px] font-semibold text-brand-ink">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-brand-ink/50">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/profile`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-brand-ink transition-colors hover:bg-brand/8 hover:text-brand"
                  >
                    <User aria-hidden="true" className="size-4" />
                    {content.profileLabel}
                  </Link>
                  <Link
                    href={`/${lang}/track-order`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-brand-ink transition-colors hover:bg-brand/8 hover:text-brand"
                  >
                    <Package aria-hidden="true" className="size-4" />
                    {content.ordersLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    {content.logoutLabel}
                  </button>
                </div>
              ) : null}
            </div>
          ) : status === "loading" ? (
            <span
              role="status"
              aria-label={content.authLoadingLabel}
              className="hidden h-12 min-w-51 animate-pulse rounded-full bg-brand-ink/15 md:block"
            />
          ) : (
            <Link
              href={`/${lang}/login`}
              className="hidden h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-brand-ink px-6 text-[17px] font-medium text-white transition-colors hover:bg-brand-hover md:flex min-[1400px]:min-w-51"
            >
              <User aria-hidden="true" className="size-6 shrink-0" />
              <span>{content.loginSignup}</span>
            </Link>
          )}

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
            {status === "authenticated" && user ? (
              <div className="mt-2 space-y-1 border-t border-brand-ink/8 pt-2 md:hidden">
                <Link
                  href={`/${lang}/profile`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium text-brand-ink hover:bg-brand/8"
                >
                  <User aria-hidden="true" className="size-5 text-brand" />
                  {content.profileLabel}
                </Link>
                <Link
                  href={`/${lang}/track-order`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium text-brand-ink hover:bg-brand/8"
                >
                  <Package aria-hidden="true" className="size-5 text-brand" />
                  {content.ordersLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[14px] font-medium text-red-700 hover:bg-red-50"
                >
                  <LogOut aria-hidden="true" className="size-5" />
                  {content.logoutLabel}
                </button>
              </div>
            ) : (
              <Link
                href={`/${lang}/login`}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover md:hidden"
              >
                <User aria-hidden="true" className="size-5" />
                {content.loginSignup}
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
