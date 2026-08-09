"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Fish,
  Flame,
  Leaf,
  Utensils,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Lang } from "@/utils/getDictionary";
import type { ItemCustomizationContent } from "@/utils/getRestaurantDictionary";
import type {
  CustomizableItem,
  MenuItemCustomizationGroup,
  MenuItemCustomizationOption,
} from "./types";

export type CustomizationStep =
  | "add-ons"
  | "cutlery"
  | "special-requests";

export interface ItemCustomizationState {
  step: CustomizationStep;
  selectedAddOns: string[];
  needsCutlery: boolean;
  specialRequest: string;
}

export interface ItemCustomizationConfirmation {
  menuItemId: string;
  customization: {
    selectedAddOns: string[];
    needsCutlery: boolean;
    specialRequest: string;
    profileKey: string;
  };
}

export interface ItemCustomizationModalProps {
  menuItem: CustomizableItem;
  lang: Lang;
  content: ItemCustomizationContent;
  onClose: () => void;
  onConfirm: (
    value: ItemCustomizationConfirmation,
  ) => Promise<void> | void;
}

function resolveText(text: { en: string; me: string }, lang: Lang) {
  return text[lang] ?? text.en;
}

function getGroupIcon(icon?: string) {
  switch (icon) {
    case "fish":
      return Fish;
    case "flame":
      return Flame;
    case "leaf":
      return Leaf;
    default:
      return Utensils;
  }
}

function formatExtraPrice(price: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "me" ? "sr-Latn-ME" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function flattenAllowedOptionIds(
  groups: MenuItemCustomizationGroup[],
) {
  return new Set(
    groups.flatMap((group) =>
      group.options.map((option) => option.id),
    ),
  );
}

export default function ItemCustomizationModal({
  menuItem,
  lang,
  content,
  onClose,
  onConfirm,
}: ItemCustomizationModalProps) {
  const customization = menuItem.customization ?? {
    enabled: true,
    profileKey: "default",
    maxAddOns: 0,
    groups: [],
    needsCutleryDefault: false,
    specialRequestMaxLength: 200,
  };
  const steps: readonly CustomizationStep[] =
    customization.groups.length > 0
      ? ["add-ons", "cutlery", "special-requests"]
      : ["cutlery", "special-requests"];
  const [state, setState] = useState<ItemCustomizationState>({
    step: steps[0],
    selectedAddOns: [],
    needsCutlery: customization.needsCutleryDefault ?? false,
    specialRequest: "",
  });
  const [limitNotice, setLimitNotice] = useState("");
  const [submitNotice, setSubmitNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const maxAddOns = customization.maxAddOns;
  const specialRequestMaxLength = customization.specialRequestMaxLength ?? 200;
  const groups = customization.groups;
  const currentStepIndex = steps.indexOf(state.step);
  const selectedCount = state.selectedAddOns.length;
  const remainingCharacters =
    specialRequestMaxLength - state.specialRequest.length;
  const allowedOptionIds = flattenAllowedOptionIds(groups);
  const portalRoot =
    typeof document === "undefined" ? null : document.body;

  if (!portalRoot) {
    return null;
  }

  const setStep = (step: CustomizationStep) => {
    setLimitNotice("");
    setState((currentState) => ({
      ...currentState,
      step,
    }));
  };

  const toggleAddOn = (optionId: string) => {
    setLimitNotice("");
    setState((currentState) => {
      const isSelected = currentState.selectedAddOns.includes(optionId);

      if (isSelected) {
        return {
          ...currentState,
          selectedAddOns: currentState.selectedAddOns.filter(
            (selectedId) => selectedId !== optionId,
          ),
        };
      }

      if (currentState.selectedAddOns.length >= maxAddOns) {
        setLimitNotice(content.addOns.limitReached);
        return currentState;
      }

      if (!allowedOptionIds.has(optionId)) {
        return currentState;
      }

      return {
        ...currentState,
        selectedAddOns: [...currentState.selectedAddOns, optionId],
      };
    });
  };

  const goBack = () => {
    if (currentStepIndex === 0) {
      onClose();
      return;
    }

    setStep(steps[currentStepIndex - 1]);
  };

  const goForward = async () => {
    if (state.step === "special-requests") {
      setIsSubmitting(true);
      setSubmitNotice("");

      try {
        await onConfirm({
          menuItemId: menuItem.id,
          customization: {
            selectedAddOns: state.selectedAddOns,
            needsCutlery: state.needsCutlery,
            specialRequest: state.specialRequest.trim(),
            profileKey: customization.profileKey,
          },
        });
        onClose();
      } catch {
        setSubmitNotice(content.submitError);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setStep(steps[currentStepIndex + 1]);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141414]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${content.breadcrumbPrefix} ${menuItem.name}`}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_34px_90px_rgba(3,8,31,0.38)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={`Close ${menuItem.name} customization`}
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="relative h-44 overflow-hidden sm:h-52">
          {menuItem.imageUrl ? (
            <Image
              src={menuItem.imageUrl}
              alt={menuItem.name}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(252,138,6,0.85),transparent_30%),linear-gradient(135deg,#18213e_15%,#03081f_100%)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 shadow-2xl backdrop-blur-sm">
                  <Utensils aria-hidden="true" className="size-9" />
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03081F]/45 via-[#03081F]/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45"
              >
                <span>{content.breadcrumbPrefix}</span>
                <span aria-hidden="true" className="text-brand/70">
                  &rsaquo;
                </span>
                <span className="truncate">{menuItem.name}</span>
                <span aria-hidden="true" className="text-brand/70">
                  &rsaquo;
                </span>
                <span className="text-brand-ink">
                  {content.breadcrumbCurrent}
                </span>
              </nav>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-3 py-1.5 text-[12px] font-semibold text-brand-ink">
                  <span className="size-2 rounded-full bg-brand" />
                  {content.progressLabel} {currentStepIndex + 1}/{steps.length}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/18 bg-[#f5f7ff] px-3 py-1.5 text-[12px] font-semibold text-brand-ink/75">
                  <CircleAlert aria-hidden="true" className="size-4 text-brand" />
                  {new Intl.NumberFormat(
                    lang === "me" ? "sr-Latn-ME" : "en-IE",
                    {
                      style: "currency",
                      currency: "EUR",
                    },
                  ).format(menuItem.price)}
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 gap-2 sm:flex">
              {steps.map((step) => {
                const active = state.step === step;
                const label =
                  content.stepLabels[
                    step === "add-ons"
                      ? "addOns"
                      : step === "cutlery"
                        ? "cutlery"
                        : "specialRequests"
                  ];

                return (
                  <span
                    key={step}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
                      active
                        ? "bg-brand-ink text-white"
                        : "bg-[#eef1fb] text-brand-ink/50",
                    )}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            {steps.includes("add-ons") && state.step === "add-ons" ? (
              <div className="animate-[special-reveal_0.45s_ease_both]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[25px] font-semibold leading-tight text-brand-ink">
                      {content.addOns.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-[14px] leading-6 text-brand-ink/62">
                      {content.addOns.subtitle}
                    </p>
                  </div>
                  <div className="rounded-full bg-brand/10 px-4 py-2 text-[13px] font-semibold text-brand">
                    {selectedCount}/{maxAddOns} {content.addOns.selectedSuffix}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/10 px-4 py-3 text-[13px] font-medium text-brand-ink/75">
                  {content.addOns.freeLimitMessage.replace(
                    "{max}",
                    String(maxAddOns),
                  )}
                </div>

                {limitNotice ? (
                  <p className="mt-2 flex items-center gap-2 text-[13px] font-medium text-brand">
                    <CircleAlert aria-hidden="true" className="size-4" />
                    {limitNotice}
                  </p>
                ) : null}

                <div className="mt-6 space-y-5">
                  {groups.map((group) => {
                    const Icon = getGroupIcon(group.icon);

                    return (
                      <section
                        key={group.id}
                        className="rounded-[20px] border border-black/10 bg-white p-4 shadow-[0_8px_24px_rgba(3,8,31,0.04)]"
                      >
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-3 py-2 text-[12px] font-semibold text-white shadow-sm">
                          <span className="flex size-6 items-center justify-center rounded-full bg-brand">
                            <Icon
                              aria-hidden="true"
                              className="size-3.5 text-white"
                            />
                          </span>
                          {resolveText(group.label, lang)}
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {group.options.map((option: MenuItemCustomizationOption) => {
                            const selected = state.selectedAddOns.includes(option.id);
                            const disabled =
                              !selected &&
                              state.selectedAddOns.length >= maxAddOns;

                            return (
                              <label
                                key={option.id}
                                className={cn(
                                  "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all",
                                  selected
                                    ? "border-brand/40 bg-brand/8 shadow-[0_6px_18px_rgba(252,138,6,0.12)]"
                                    : "border-black/10 bg-white hover:border-brand/30 hover:bg-brand/4",
                                  disabled && "cursor-not-allowed opacity-45",
                                )}
                              >
                                <span className="relative flex size-5 shrink-0 items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={selected}
                                    disabled={disabled}
                                    onChange={() => toggleAddOn(option.id)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={cn(
                                      "flex size-5 items-center justify-center rounded-[6px] border-2 transition-colors",
                                      selected
                                        ? "border-brand bg-brand text-white"
                                        : "border-black/25 bg-white",
                                    )}
                                  >
                                    <Check
                                      aria-hidden="true"
                                      className={cn(
                                        "size-3.5 transition-transform",
                                        selected ? "scale-100" : "scale-0",
                                      )}
                                    />
                                  </span>
                                </span>
                                <span className="min-w-0 flex-1 text-[14px] font-medium text-brand-ink">
                                  {resolveText(option.label, lang)}
                                </span>
                                {option.extraPrice ? (
                                  <span className="shrink-0 text-[12px] font-semibold text-brand">
                                    +{formatExtraPrice(option.extraPrice, lang)}
                                  </span>
                                ) : null}
                              </label>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[22px] border border-brand/15 bg-[#fffaf2] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-ink/55">
                        {content.addOns.totalLabel}
                      </p>
                      <p className="mt-1 text-[24px] font-semibold text-brand">
                        {new Intl.NumberFormat(
                          lang === "me" ? "sr-Latn-ME" : "en-IE",
                          {
                            style: "currency",
                            currency: "EUR",
                          },
                        ).format(menuItem.price)}
                      </p>
                    </div>
                    <p className="max-w-[260px] text-right text-[12px] leading-5 text-brand-ink/55">
                      {content.addOns.freeWithinLimitNote}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {state.step === "cutlery" ? (
              <div className="animate-[special-reveal_0.45s_ease_both]">
                <h2 className="text-[25px] font-semibold leading-tight text-brand-ink">
                  {content.cutlery.title}
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-6 text-brand-ink/62">
                  {content.cutlery.subtitle}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      value: true,
                      title: content.cutlery.yes,
                    },
                    {
                      value: false,
                      title: content.cutlery.no,
                    },
                  ].map((option) => {
                    const selected = state.needsCutlery === option.value;

                    return (
                      <button
                        key={option.title}
                        type="button"
                        onClick={() =>
                          setState((currentState) => ({
                            ...currentState,
                            needsCutlery: option.value,
                          }))
                        }
                        className={cn(
                          "rounded-[24px] border p-5 text-left transition-all",
                          selected
                            ? "border-brand/45 bg-brand/8 shadow-[0_10px_28px_rgba(252,138,6,0.12)]"
                            : "border-black/10 bg-white hover:border-brand/30 hover:bg-brand/4",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-12 items-center justify-center rounded-2xl",
                            selected
                              ? "bg-brand text-white"
                              : "bg-[#eef1fb] text-brand-ink",
                          )}
                        >
                          {option.value ? (
                            <Check aria-hidden="true" className="size-6" />
                          ) : (
                            <X aria-hidden="true" className="size-6" />
                          )}
                        </span>
                        <h3 className="mt-4 text-[19px] font-semibold text-brand-ink">
                          {option.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-6 text-brand-ink/62">
                          {content.cutlery.helper}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {state.step === "special-requests" ? (
              <div className="animate-[special-reveal_0.45s_ease_both]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[25px] font-semibold leading-tight text-brand-ink">
                      {content.specialRequests.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-[14px] leading-6 text-brand-ink/62">
                      {content.specialRequests.subtitle}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eef1fb] px-3 py-1.5 text-[12px] font-semibold text-brand-ink/60">
                    {content.specialRequests.optional}
                  </span>
                </div>

                <label className="mt-5 block">
                  <span className="sr-only">{content.specialRequests.title}</span>
                  <textarea
                    maxLength={specialRequestMaxLength}
                    value={state.specialRequest}
                    onChange={(event) =>
                      setState((currentState) => ({
                        ...currentState,
                        specialRequest: event.target.value,
                      }))
                    }
                    placeholder={content.specialRequests.placeholder}
                    className="min-h-40 w-full rounded-[24px] border border-black/10 bg-white px-5 py-4 text-[15px] leading-7 text-brand-ink outline-none transition-colors placeholder:text-brand-ink/35 focus:border-brand/45 focus:ring-2 focus:ring-brand/10"
                  />
                </label>

                <div className="mt-3 flex items-center justify-between gap-4 text-[12px] font-medium text-brand-ink/50">
                  <span>
                    {content.specialRequests.characterCount.replace(
                      "{remaining}",
                      String(remainingCharacters),
                    )}
                  </span>
                  <span>
                    {state.specialRequest.length}/{specialRequestMaxLength}
                  </span>
                </div>
              </div>
            ) : null}

            {submitNotice ? (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700">
                {submitNotice}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold text-brand-ink transition-colors hover:border-brand/35 hover:bg-brand/5"
            >
              <ChevronLeft aria-hidden="true" className="size-4.5" />
              {currentStepIndex === 0 && steps[0] === "add-ons"
                ? content.addOns.takeMeBack
                : state.step === "cutlery"
                  ? content.cutlery.back
                  : content.specialRequests.back}
            </button>

            <button
              type="button"
              onClick={() => void goForward()}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70",
                state.step === "special-requests"
                  ? "bg-brand-green"
                  : "bg-brand",
              )}
            >
              {state.step === "special-requests"
                ? content.specialRequests.addToCart
                : state.step === "add-ons"
                  ? content.addOns.nextStep
                  : content.cutlery.nextStep}
              {state.step === "special-requests" ? null : (
                <ChevronRight aria-hidden="true" className="size-4.5" />
              )}
            </button>
          </div>
        </div>
      </section>
    </div>,
    portalRoot,
  );
}
