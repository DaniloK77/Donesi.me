import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Star } from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import {
  translateCategory,
  type CategoryTranslations,
} from "@/utils/categoryTranslations";
import type { RestaurantDiscoveryContent } from "@/utils/getRestaurantDictionary";
import type { RestaurantSummary } from "./RestaurantDiscoverySection";

export type RestaurantDiscoveryCardProps = {
  restaurant: RestaurantSummary;
  lang: Lang;
  content: RestaurantDiscoveryContent;
  categoryTranslations: CategoryTranslations;
};

export default function RestaurantDiscoveryCard({
  restaurant,
  lang,
  content,
  categoryTranslations,
}: RestaurantDiscoveryCardProps) {
  return (
    <Link
      href={`/${lang}/restaurants/${restaurant.slug}`}
      className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(3,8,31,0.07)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(3,8,31,0.12)]"
    >
      <div className="relative h-48 overflow-hidden bg-brand-surface">
        <Image
          src={restaurant.logoUrl}
          alt={restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-brand-ink shadow-sm">
          <Star
            aria-hidden="true"
            className="size-3.5 fill-[#FFB800] text-[#FFB800]"
          />
          <span className="sr-only">{content.ratingLabel}:</span>
          {restaurant.rating.toFixed(1)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-[19px] font-semibold text-brand-ink">
          {restaurant.name}
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-brand-ink/60">
          {translateCategory(restaurant.category, categoryTranslations)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-brand-ink/70">
          <span className="flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-4 text-brand" />
            {content.deliveryLabel}: {restaurant.deliveryTimeMin} min
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-4 text-brand" />
            {restaurant.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
