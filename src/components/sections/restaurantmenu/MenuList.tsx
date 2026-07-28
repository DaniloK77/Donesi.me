import { Utensils } from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import type { MenuCategory } from "./types";

export interface MenuListProps {
  categories: MenuCategory[];
  lang: Lang;
  title: string;
}

export default function MenuList({
  categories,
  lang,
  title,
}: MenuListProps) {
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    {
      style: "currency",
      currency: "EUR",
    },
  );

  return (
    <section
      aria-labelledby="restaurant-menu-heading"
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-382"
    >
      <h2
        id="restaurant-menu-heading"
        className="text-[34px] font-bold text-brand-ink"
      >
        {title}
      </h2>

      <div className="mt-10 space-y-14">
        {categories.map((category) => (
          <section
            key={category.id}
            aria-labelledby={`menu-category-${category.id}`}
          >
            <h3
              id={`menu-category-${category.id}`}
              className="text-[26px] font-semibold text-brand-ink"
            >
              {category.name}
            </h3>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {category.items.map((item) => (
                <article
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  data-testid={`menu-item-${item.id}`}
                  className="flex min-h-34 scroll-m-8 items-center gap-5 rounded-xl border border-black/10 bg-white p-5 shadow-[0_8px_26px_rgba(3,8,31,0.06)] ring-brand transition-[box-shadow,transform] duration-300 data-[highlighted=true]:-translate-y-0.5 data-[highlighted=true]:shadow-[0_12px_34px_rgba(252,138,6,0.18)] data-[highlighted=true]:ring-2"
                >
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Utensils aria-hidden="true" className="size-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-5">
                      <h4 className="text-[17px] font-semibold leading-6 text-brand-ink">
                        {item.name}
                      </h4>
                      <p className="shrink-0 text-[17px] font-bold text-brand">
                        {priceFormatter.format(item.price)}
                      </p>
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-[13px] leading-5 text-brand-ink/65">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
