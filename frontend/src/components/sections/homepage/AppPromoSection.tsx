import Image from "next/image";
import Link from "next/link";

export interface AppPromoSectionProps {
  imageUrl: string;
  imageAlt: string;
  ariaLabel: string;
  brandName: string;
  brandAccent: string;
  titlePrimary: string;
  titleAccent: string;
  titleSuffix: string;
  appStoreLabel: string;
  googlePlayLabel: string;
  subtitle?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  storeBadgesImageUrl?: string;
  showStoreBadges?: boolean;
}

type StoreBadgeProps = {
  href: string;
  label: string;
  imageUrl: string;
  platform: "app-store" | "google-play";
};

function StoreBadge({
  href,
  label,
  imageUrl,
  platform,
}: StoreBadgeProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative block h-15.25 w-51.5 overflow-hidden rounded-xl transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Image
        src={imageUrl}
        alt=""
        width={412}
        height={61}
        className={`absolute top-0 h-15.25 w-103 max-w-none ${
          platform === "google-play" ? "-left-51.5" : "left-0"
        }`}
      />
    </Link>
  );
}

export default function AppPromoSection({
  imageUrl,
  imageAlt,
  ariaLabel,
  brandName,
  brandAccent,
  titlePrimary,
  titleAccent,
  titleSuffix,
  appStoreLabel,
  googlePlayLabel,
  subtitle = "",
  appStoreUrl = "",
  googlePlayUrl = "",
  storeBadgesImageUrl = "/images/app-promo/store-badges.png",
  showStoreBadges = false,
}: AppPromoSectionProps) {
  const hasStoreLinks = Boolean(appStoreUrl || googlePlayUrl);

  return (
    <section
      aria-label={ariaLabel}
      className="mx-auto mt-16 grid w-[calc(100%-2rem)] max-w-382 grid-cols-1 overflow-hidden rounded-xl bg-[#EEEEEE] md:h-152.5 md:grid-cols-2"
    >
      <div className="relative h-64 overflow-hidden sm:h-80 md:h-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="764px"
          className="object-contain object-bottom"
        />
      </div>

      <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center sm:px-8 md:py-0">
        <h2 className="text-[26px] font-bold leading-8 text-brand-ink sm:text-[34px] sm:leading-10 lg:text-[48px] lg:leading-14">
          <span className="block">
            {brandName}
            <span className="text-brand">{brandAccent}</span>{" "}
            {titlePrimary}
          </span>
          <span className="mt-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-[120px] bg-brand-ink px-5 py-3 text-[20px] leading-7 text-white sm:whitespace-nowrap sm:px-8 sm:py-4 sm:text-[26px] sm:leading-9 lg:text-[34px] lg:leading-10">
            <span className="shrink-0 text-brand underline decoration-2 underline-offset-4">
              {titleAccent}
            </span>
            <span className="shrink-0">{titleSuffix}</span>
          </span>
        </h2>

        {subtitle ? (
          <p className="mt-6 text-[18px] font-medium leading-7 text-brand-ink">
            {subtitle}
          </p>
        ) : null}

        {hasStoreLinks ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            {appStoreUrl ? (
              <StoreBadge
                href={appStoreUrl}
                label={appStoreLabel}
                imageUrl={storeBadgesImageUrl}
                platform="app-store"
              />
            ) : null}
            {googlePlayUrl ? (
              <StoreBadge
                href={googlePlayUrl}
                label={googlePlayLabel}
                imageUrl={storeBadgesImageUrl}
                platform="google-play"
              />
            ) : null}
          </div>
        ) : showStoreBadges ? (
          <Image
            src={storeBadgesImageUrl}
            alt={`${appStoreLabel}; ${googlePlayLabel}`}
            width={412}
            height={61}
            className="mt-6 h-auto w-full max-w-103"
          />
        ) : null}
      </div>
    </section>
  );
}
