import Image from "next/image";
import { cn } from "@/lib/utils";

export interface DealDiscountBadgeProps {
  discountPercentage: number;
  className?: string;
}

export function DealDiscountBadge({
  discountPercentage,
  className,
}: DealDiscountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-brand font-bold text-white",
        className,
      )}
    >
      -{discountPercentage}%
    </span>
  );
}

export interface DealPricingProps {
  originalPrice: number;
  discountPercentage: number;
  formatPrice: (price: number) => string;
  className?: string;
}

export function DealPricing({
  originalPrice,
  discountPercentage,
  formatPrice,
  className,
}: DealPricingProps) {
  const discountedPrice = Number(
    (originalPrice * (1 - discountPercentage / 100)).toFixed(2),
  );

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <DealDiscountBadge
        discountPercentage={discountPercentage}
        className="h-7 rounded-full px-2.5 text-[11px]"
      />
      <span className="text-[13px] font-medium text-brand-ink/45 line-through">
        {formatPrice(originalPrice)}
      </span>
      <span className="text-[17px] font-bold text-brand">
        {formatPrice(discountedPrice)}
      </span>
    </span>
  );
}

export interface DealCardProps {
  name: string;
  label?: string;
  imageUrl: string;
  discountPercentage: number;
}

export default function DealCard({
  name,
  label,
  imageUrl,
  discountPercentage,
}: DealCardProps) {
  return (
    <article className="group relative h-83 overflow-hidden rounded-xl bg-brand-ink">
      <Image
        src={imageUrl}
        alt={name}
        fill
        sizes="(min-width: 1280px) 496px, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-brand-ink/10 to-transparent" />

      <DealDiscountBadge
        discountPercentage={discountPercentage}
        className="absolute right-5 top-0 h-18 w-24 rounded-b-xl bg-brand-ink text-2xl"
      />

      <div className="absolute bottom-8 left-10 right-8">
        {label ? (
          <p className="text-lg font-medium leading-7 text-brand">{label}</p>
        ) : null}
        <h3 className="mt-1 text-2xl font-bold leading-8 text-white">{name}</h3>
      </div>
    </article>
  );
}
