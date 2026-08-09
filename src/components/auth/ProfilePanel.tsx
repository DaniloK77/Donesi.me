"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import type { Lang } from "@/utils/getDictionary";
import type { ProfileContent } from "@/utils/getAuthDictionary";
import { useDeliveryLocation } from "@/components/delivery";
import { AuthApiError, useAuth } from "./AuthProvider";

export default function ProfilePanel({
  lang,
  content,
}: {
  lang: Lang;
  content: ProfileContent;
}) {
  const { user, updateProfile } = useAuth();
  const { location, openPopup } = useDeliveryLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const startEditing = () => {
    setName(user.name);
    setPhone(user.phone ?? "");
    setFieldErrors({});
    setFormError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFieldErrors({});
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: { name?: string; phone?: string } = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      errors.name = content.editProfile.validation.name;
    }

    if (trimmedPhone && trimmedPhone.length < 6) {
      errors.phone = content.editProfile.validation.phone;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await updateProfile({
        name: trimmedName,
        phone: trimmedPhone || null,
      });
      setSuccessMessage(content.editProfile.successLabel);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof AuthApiError && error.fields) {
        setFieldErrors({
          name: error.fields.name?.[0],
          phone: error.fields.phone?.[0],
        });
      }
      setFormError(content.editProfile.errors.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = [
    { icon: User, label: content.nameLabel, value: user.name },
    { icon: Mail, label: content.emailLabel, value: user.email },
    {
      icon: Phone,
      label: content.phoneLabel,
      value: user.phone ?? content.noPhoneLabel,
    },
    {
      icon: ShieldCheck,
      label: content.roleLabel,
      value: content.roleLabels[user.role] ?? user.role,
    },
    {
      icon: BadgeCheck,
      label: content.verificationLabel,
      value: user.emailVerified
        ? content.verifiedLabel
        : content.unverifiedLabel,
    },
  ];

  const inputClassName =
    "h-11 w-full rounded-lg border border-brand-ink/15 bg-white px-3.5 text-[14px] text-brand-ink outline-none transition-colors placeholder:text-brand-ink/35 focus:border-brand disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-382">
      <div className="rounded-3xl bg-brand-ink px-8 py-10 text-white sm:px-12">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 text-[42px] font-bold">{content.title}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/65">
          {content.description}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-brand-ink/8 bg-white p-6 shadow-[0_16px_50px_rgba(3,8,31,0.07)] sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold text-brand-ink">
              {content.title}
            </h2>
            {!isEditing ? (
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-1.5 rounded-full border border-brand px-4 py-1.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                {content.editProfile.editLabel}
              </button>
            ) : null}
          </div>

          {successMessage && !isEditing ? (
            <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
              {successMessage}
            </p>
          ) : null}

          {isEditing ? (
            <form onSubmit={handleSubmit} noValidate className="grid gap-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-brand-ink/60">
                  {content.nameLabel}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={content.editProfile.namePlaceholder}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={inputClassName}
                />
                {fieldErrors.name ? (
                  <span className="mt-1.5 block text-[12px] text-red-700">
                    {fieldErrors.name}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-brand-ink/60">
                  {content.phoneLabel}
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={content.editProfile.phonePlaceholder}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={inputClassName}
                />
                {fieldErrors.phone ? (
                  <span className="mt-1.5 block text-[12px] text-red-700">
                    {fieldErrors.phone}
                  </span>
                ) : null}
              </label>

              {formError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800"
                >
                  {formError}
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg bg-brand text-[14px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? content.editProfile.savingLabel
                    : content.editProfile.saveLabel}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                  className="h-11 rounded-lg border border-brand-ink/15 px-5 text-[14px] font-semibold text-brand-ink/70 transition-colors hover:border-brand-ink/30"
                >
                  {content.editProfile.cancelLabel}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-brand-surface p-5">
                  <Icon aria-hidden="true" className="size-5 text-brand" />
                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-[15px] font-semibold text-brand-ink">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-brand-ink/8 bg-brand-surface p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-bold text-brand-ink">
                {content.location.title}
              </h2>
              <button
                type="button"
                onClick={openPopup}
                className="shrink-0 rounded-full border border-brand px-4 py-1.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                {location
                  ? content.location.changeLabel
                  : content.location.setLabel}
              </button>
            </div>

            {location ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white p-5">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand"
                />
                <div className="min-w-0">
                  <p className="break-words text-[15px] font-semibold text-brand-ink">
                    {location.street}
                  </p>
                  <p className="text-[13px] text-brand-ink/60">
                    {location.city}
                  </p>
                  <p className="mt-2 text-[12px] text-brand-ink/45">
                    {content.location.coordinatesLabel}:{" "}
                    {location.latitude.toFixed(5)},{" "}
                    {location.longitude.toFixed(5)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-[14px] leading-6 text-brand-ink/60">
                {content.location.emptyLabel}
              </p>
            )}
          </div>

          <div
            id="orders"
            className="rounded-3xl border border-brand-ink/8 bg-brand-surface p-8"
          >
            <h2 className="text-[24px] font-bold text-brand-ink">
              {content.ordersTitle}
            </h2>
            <p className="mt-4 text-[14px] leading-6 text-brand-ink/60">
              {content.ordersEmpty}
            </p>
            <Link
              href={`/${lang}/track-order`}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand px-5 py-2.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <Package aria-hidden="true" className="size-4" />
              {content.ordersCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
