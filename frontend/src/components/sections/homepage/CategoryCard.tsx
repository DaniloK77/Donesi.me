import Image from "next/image";

export interface CategoryCardProps {
  name: string;
  imageUrl: string;
  restaurantCount: number;
  restaurantsLabel: string;
}

export default function CategoryCard({
  name,
  imageUrl,
  restaurantCount,
  restaurantsLabel,
}: CategoryCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-black/15 bg-brand-surface">
      <div className="relative h-50.75 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="238px"
          className="object-cover"
        />
      </div>

      <div className="flex h-22 flex-col justify-center px-5">
        <h3 className="text-lg font-bold leading-7 text-brand-ink">{name}</h3>
        <p className="text-sm font-normal leading-5 text-brand">
          {restaurantCount} {restaurantsLabel}
        </p>
      </div>
    </article>
  );
}
