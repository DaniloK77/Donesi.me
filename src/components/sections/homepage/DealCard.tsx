import Image from "next/image";

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

      <div className="absolute right-5 top-0 flex h-18 w-24 items-center justify-center rounded-b-xl bg-brand-ink text-2xl font-bold text-white">
        -{discountPercentage}%
      </div>

      <div className="absolute bottom-8 left-10 right-8">
        {label ? (
          <p className="text-lg font-medium leading-7 text-brand">{label}</p>
        ) : null}
        <h3 className="mt-1 text-2xl font-bold leading-8 text-white">{name}</h3>
      </div>
    </article>
  );
}
