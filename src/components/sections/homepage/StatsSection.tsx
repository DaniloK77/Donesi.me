import type { StatsContent } from "@/utils/getDictionary";
import type { HomepageSectionProps } from "./types";

export type StatsSectionProps = Omit<HomepageSectionProps, "content"> & {
  content: StatsContent;
};

export default function StatsSection({ content }: StatsSectionProps) {
  return (
    <section
      aria-label={content.ariaLabel}
      className="relative mx-auto mt-16 w-[calc(100%-2rem)] min-w-300 max-w-382 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#F97800] via-[#FC8A06] to-[#FFA21A] px-5 py-8 text-white shadow-[0_18px_45px_-22px_rgba(252,138,6,0.85)] sm:px-8 sm:py-10 lg:px-12"
      data-testid="stats-section"
    >
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-28 size-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-16 size-72 rounded-full bg-[#FFD18A]/15 blur-3xl"
      />

      <dl className="relative grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
        {content.items.map((item, index) => (
          <div
            key={item.label}
            className={`flex min-h-24 flex-col items-center justify-center px-4 text-center md:min-h-26 md:px-7 ${
              index % 2 !== 0 ? "border-l border-white/45" : ""
            } ${index > 0 ? "md:border-l md:border-white/45" : "md:border-l-0"}`}
          >
            <dt className="order-2 mt-2 text-[12px] font-semibold leading-5 text-white/90 sm:text-[13px]">
              {item.label}
            </dt>
            <dd className="order-1 text-[32px] font-medium leading-none tracking-[-0.035em] sm:text-[38px] lg:text-[42px]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
