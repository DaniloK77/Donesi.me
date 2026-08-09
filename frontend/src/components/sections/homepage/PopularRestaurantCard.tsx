import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/utils/getDictionary";

export interface PopularRestaurantCardProps {
  name: string;
  logoUrl: string;
  slug: string;
  lang: Lang;
}

export default function PopularRestaurantCard({
  name,
  logoUrl,
  slug,
  lang,
}: PopularRestaurantCardProps) {
  return (
    <Link
      href={`/${lang}/restaurants/${slug}`}
      aria-label={name}
      className="group block w-full overflow-hidden rounded-xl border border-black/15 bg-brand"
    >
      <div className="relative h-44 w-full overflow-hidden bg-white">
        <Image
          src={logoUrl}
          alt={name}
          fill
          sizes="202px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex h-16 items-center justify-center px-3 text-center">
        <h3 className="text-base font-bold leading-5 text-white">{name}</h3>
      </div>
    </Link>
  );
}
