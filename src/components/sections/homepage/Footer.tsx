import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
} from "react-icons/fa";
import type { FooterContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type FooterProps = Omit<HomepageSectionProps, "content"> & {
  content: FooterContent;
};

const socialIcons = [
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
];

export default function Footer({ content }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#D9D9D9] text-brand-ink">
      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-382 gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[1.1fr_1.3fr_0.8fr_0.8fr] lg:gap-10 lg:px-12 lg:py-16">
        <div>
          <Image
            src="/brand/donesi-me-logo.png"
            alt={content.logoAlt}
            width={215}
            height={53}
            className="h-auto w-53.75"
          />

          <Image
            src="/images/app-promo/store-badges.png"
            alt={content.storeBadgesAlt}
            width={412}
            height={61}
            className="mt-6 h-auto w-86 max-w-full"
          />

          <p className="mt-5 max-w-75 text-[12px] leading-5 text-brand-ink/75">
            {content.companyText}
          </p>
        </div>

        <div>
          <h2 className="text-[15px] font-bold leading-6">
            {content.newsletterTitle}
          </h2>

          <div className="mt-7 flex max-w-115 rounded-full bg-white/75 p-1.5 shadow-sm">
            <label htmlFor="footer-email" className="sr-only">
              {content.emailLabel}
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder={content.emailPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-5 text-[13px] outline-none placeholder:text-brand-ink/45"
            />
            <button
              type="button"
              className="shrink-0 rounded-full bg-brand px-7 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#E97900] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
            >
              {content.subscribeLabel}
            </button>
          </div>

          <p className="mt-3 pl-5 text-[11px] text-brand-ink/65">
            {content.privacyPrefix}{" "}
            <span className="underline underline-offset-2">
              {content.privacyLabel}
            </span>
          </p>

          <div
            className="mt-5 flex items-center gap-3"
            aria-label={content.socialAriaLabel}
          >
            {content.socialLabels.map((label, index) => {
              const Icon = socialIcons[index];

              return Icon ? (
                <span
                  key={label}
                  title={label}
                  className="flex size-8 items-center justify-center rounded-full bg-brand-ink text-white"
                >
                  <Icon aria-hidden="true" size={17} />
                  <span className="sr-only">{label}</span>
                </span>
              ) : null;
            })}
          </div>
        </div>

        {[content.legalColumn, content.linksColumn].map((column) => (
          <div key={column.title}>
            <h2 className="text-[15px] font-bold leading-6">{column.title}</h2>
            <ul className="mt-5 space-y-4">
              {column.items.map((item) => (
                <li
                  key={item}
                  className="text-[12px] leading-4 text-brand-ink/80 underline decoration-brand-ink/45 underline-offset-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-brand-ink text-white">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-382 flex-col gap-5 px-4 py-6 text-[11px] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>
            © donesi.me {currentYear}. {content.copyrightText}
          </p>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-white/85">
            {content.bottomLinks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
