import Image from "next/image";
import type { RestaurantInformationContent } from "@/utils/getRestaurantDictionary";

export interface RestaurantInformationSectionProps {
  restaurantName: string;
  deliveryTimeMin: number;
  content: RestaurantInformationContent;
}

export default function RestaurantInformationSection({
  restaurantName,
  deliveryTimeMin,
  content,
}: RestaurantInformationSectionProps) {
  return (
    <section
      aria-label={`${restaurantName}: ${content.ariaLabel}`}
      className="mx-auto my-18 w-[calc(100%-2rem)] max-w-382 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_14px_42px_rgba(3,8,31,0.12)]"
    >
      <div className="grid lg:min-h-165 lg:grid-cols-3">
        <div className="px-7 py-11 sm:px-10 lg:px-12 lg:py-20 xl:px-14">
          <div className="flex items-center gap-3 text-brand-ink">
            <Image
              src="/icons/restaurant-info-tracking.svg"
              alt=""
              width={45}
              height={45}
              className="size-11.25 shrink-0"
            />
            <h2 className="text-[24px] font-bold leading-tight">
              {content.deliveryTitle}
            </h2>
          </div>

          <dl className="mt-9 space-y-3.5 text-[13px] leading-6 text-brand-ink">
            {content.deliverySchedule.map((day) => (
              <div key={day.label} className="flex items-baseline gap-1">
                <dt className="shrink-0 font-bold">{day.label}:</dt>
                <dd>{day.hours}</dd>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline gap-x-1 pt-1">
              <dt className="font-bold">{content.estimatedDeliveryLabel}:</dt>
              <dd>
                {deliveryTimeMin} {content.minutesLabel}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-y border-black/10 px-7 py-11 sm:px-10 lg:border-0 lg:px-12 lg:py-20 xl:px-14">
          <div className="flex items-center gap-3 text-brand-ink">
            <Image
              src="/icons/restaurant-info-id-verified.svg"
              alt=""
              width={45}
              height={45}
              className="size-11.25 shrink-0"
            />
            <h2 className="text-[24px] font-bold leading-tight">
              {content.contactTitle}
            </h2>
          </div>

          <p className="mt-9 max-w-88 text-[14px] leading-8 text-brand-ink">
            {content.contactDescription}
          </p>

          <dl className="mt-4 space-y-4 text-brand-ink">
            <div>
              <dt className="text-[14px] font-bold">{content.phoneLabel}</dt>
              <dd className="mt-1.5 text-[18px]">
                <a
                  href={`tel:${content.phoneNumber.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-brand"
                >
                  {content.phoneNumber}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-bold">{content.websiteLabel}</dt>
              <dd className="mt-1.5 text-[18px]">
                {content.websiteDisplay}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-brand-ink px-7 py-11 text-white sm:px-10 lg:px-12 lg:py-20 xl:px-14">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/restaurant-info-clock.svg"
              alt=""
              width={45}
              height={45}
              className="size-11.25 shrink-0"
            />
            <h2 className="text-[24px] font-bold leading-tight">
              {content.operationalTitle}
            </h2>
          </div>

          <dl className="mt-9 space-y-3.5 text-[13px] leading-6 text-white">
            {content.operationalSchedule.map((day) => (
              <div key={day.label} className="flex items-baseline gap-1">
                <dt className="shrink-0 font-bold">{day.label}:</dt>
                <dd>{day.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
