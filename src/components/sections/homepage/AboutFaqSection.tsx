"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";

export type TabId = "faq" | "about" | "partner" | "support";

export interface AboutFaqTab {
  id: TabId;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  iconUrl: string;
  title: string;
  description: string;
}

export interface AboutFaqSectionProps {
  title: string;
  tabsAriaLabel: string;
  tabs: AboutFaqTab[];
  faqItems: FaqItem[];
  steps: HowItWorksStep[];
  summaryText: string;
  placeholderText: string;
  faqOnly?: boolean;
  fullBleed?: boolean;
}

export default function AboutFaqSection({
  title,
  tabsAriaLabel,
  tabs,
  faqItems,
  steps,
  summaryText,
  placeholderText,
  faqOnly = false,
  fullBleed = false,
}: AboutFaqSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("faq");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionId = useId();

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const lastIndex = tabs.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];

    if (nextTab) {
      setActiveTab(nextTab.id);
      tabButtonRefs.current[nextIndex]?.focus();
    }
  };

  const faqList = faqItems.map((item, index) => {
    const isOpen = openFaqIndex === index;
    const answerId = `${sectionId}-answer-${index}`;

    return (
      <article
        key={item.question}
        className={faqOnly ? "self-start" : undefined}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() =>
            setOpenFaqIndex((currentIndex) =>
              currentIndex === index ? null : index,
            )
          }
          className={`w-full rounded-[120px] px-6 py-3.5 text-left text-[15px] font-semibold leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            isOpen
              ? "bg-brand text-white"
              : faqOnly
                ? "border border-brand-ink/8 bg-brand-surface text-brand-ink hover:border-brand/30 hover:bg-brand/10"
                : "bg-transparent text-brand-ink hover:bg-brand/10"
          }`}
        >
          {item.question}
        </button>

        {isOpen ? (
          <div
            id={answerId}
            className="mx-4 rounded-b-xl bg-brand/8 px-5 pb-5 pt-4"
          >
            <p className="text-[14px] leading-6 text-brand-ink/75">
              {item.answer}
            </p>
          </div>
        ) : null}
      </article>
    );
  });

  return (
    <section
      aria-labelledby={`${sectionId}-title`}
      className={
        fullBleed
          ? "mt-16 w-full min-w-300 bg-[#D9D9D9] py-18"
          : "mx-auto mt-16 w-[calc(100%-2rem)] min-w-300 max-w-382 rounded-xl bg-[#D9D9D9] px-22 py-18"
      }
    >
      <div
        className={
          fullBleed
            ? "mx-auto w-[calc(100%-2rem)] max-w-382 px-22"
            : undefined
        }
      >
      <div className="flex items-center justify-between gap-12">
        <h2
          id={`${sectionId}-title`}
          className="text-[32px] font-bold leading-12 text-brand-ink"
        >
          {title}
        </h2>

        {!faqOnly ? (
          <div
            role="tablist"
            aria-label={tabsAriaLabel}
            className="flex items-center gap-3"
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  ref={(element) => {
                    tabButtonRefs.current[index] = element;
                  }}
                  id={`${sectionId}-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${sectionId}-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`h-12 rounded-[120px] border-2 px-6 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    isActive
                      ? "border-brand bg-white text-brand-ink"
                      : "border-transparent text-brand-ink hover:border-brand hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {faqOnly ? (
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-xl bg-white px-13 py-10 shadow-sm">
          {faqList}
        </div>
      ) : (
        <div
          id={`${sectionId}-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`${sectionId}-tab-${activeTab}`}
          className="mt-13 min-h-145 rounded-xl bg-white px-13 py-12 shadow-sm"
        >
          {activeTab === "faq" ? (
            <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-14">
              <div className="space-y-3">{faqList}</div>

              <div>
                <div className="grid grid-cols-3 gap-5">
                  {steps.map((step) => (
                    <article
                      key={step.title}
                      className="flex h-80 flex-col items-center rounded-xl bg-[#D9D9D9] px-5 py-7 text-center"
                    >
                      <h3 className="text-[17px] font-bold leading-6 text-brand-ink">
                        {step.title}
                      </h3>

                      <div className="relative mt-6 size-31 shrink-0">
                        {step.iconUrl ? (
                          <Image
                            src={step.iconUrl}
                            alt=""
                            fill
                            sizes="124px"
                            className="object-contain"
                          />
                        ) : null}
                      </div>

                      <p className="mt-5 text-[13px] leading-5 text-brand-ink/75">
                        {step.description}
                      </p>
                    </article>
                  ))}
                </div>

                <p className="mx-auto mt-8 max-w-205 text-center text-[14px] leading-6 text-brand-ink/75">
                  {summaryText}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-120 items-center justify-center">
              <p className="rounded-[120px] bg-[#D9D9D9] px-10 py-4 text-[16px] font-medium text-brand-ink/70">
                {placeholderText}
              </p>
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
