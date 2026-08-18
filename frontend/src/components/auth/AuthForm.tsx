"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import type { Lang } from "@/utils/getDictionary";
import type { AuthFormContent } from "@/utils/getAuthDictionary";
import { AuthApiError, useAuth } from "./AuthProvider";
import type { UserRole } from "./types";

type AuthFormMode = "login" | "register";

type AuthFormProps = {
  mode: AuthFormMode;
  lang: Lang;
  content: AuthFormContent;
};

type AuthFormFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type AuthFormErrors = Partial<Record<keyof AuthFormFields, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where to land after signing in. An explicit `next` always wins — someone who
 * followed a link to a specific page should end up there. Otherwise admins go
 * straight to their panel instead of having to know the URL.
 */
function getSafeDestination(lang: Lang, role?: UserRole) {
  const requestedPath = new URLSearchParams(window.location.search).get(
    "next",
  );

  if (requestedPath?.startsWith(`/${lang}/`)) {
    return requestedPath;
  }

  return role === "ADMIN" ? `/${lang}/admin` : `/${lang}/profile`;
}

export default function AuthForm({ mode, lang, content }: AuthFormProps) {
  const { login, register, status, user } = useAuth();
  const router = useRouter();
  const [fields, setFields] = useState<AuthFormFields>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isRegister = mode === "register";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getSafeDestination(lang, user?.role));
    }
  }, [lang, router, status, user]);

  const updateField = (field: keyof AuthFormFields, value: string) => {
    setFields((currentFields) => ({ ...currentFields, [field]: value }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setFormError(null);
  };

  const validate = () => {
    const errors: AuthFormErrors = {};

    if (isRegister && fields.name.trim().length < 2) {
      errors.name = content.validation.name;
    }

    if (!emailPattern.test(fields.email.trim())) {
      errors.email = content.validation.email;
    }

    if (fields.password.length < 8) {
      errors.password = content.validation.password;
    }

    if (
      isRegister &&
      fields.phone.trim() &&
      fields.phone.trim().length < 6
    ) {
      errors.phone = content.validation.phone;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // New accounts are always customers, so only the login path can land on
      // an admin destination.
      let signedInUser;

      if (isRegister) {
        signedInUser = await register({
          name: fields.name.trim(),
          email: fields.email.trim(),
          password: fields.password,
          phone: fields.phone.trim() || undefined,
        });
      } else {
        signedInUser = await login({
          email: fields.email.trim(),
          password: fields.password,
        });
      }

      router.replace(getSafeDestination(lang, signedInUser.role));
      router.refresh();
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.code === "EMAIL_ALREADY_EXISTS") {
          setFormError(content.errors.emailExists);
        } else if (error.code === "INVALID_CREDENTIALS") {
          setFormError(content.errors.invalidCredentials);
        } else if (error.code === "AUTH_RATE_LIMITED") {
          setFormError(content.errors.rateLimited);
        } else {
          setFormError(content.errors.generic);
        }
      } else {
        setFormError(content.errors.generic);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "h-10 w-full rounded-lg border border-[rgba(3,8,31,0.16)] bg-white px-3 text-[13px] text-brand-ink outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-brand-ink/35 focus:border-brand focus:shadow-[0_0_0_3px_rgba(252,138,6,0.14)] motion-safe:focus:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 xl:h-12 xl:px-4 xl:text-[14px]";

  const tabClassName =
    "flex min-h-8 flex-1 items-center justify-center rounded-full px-3 text-[13px] font-medium transition-[color,background-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:min-h-11 xl:text-[14px]";

  return (
    <section className="auth-card-enter mx-auto w-[calc(100%-2rem)] max-w-[1100px] rounded-2xl bg-brand-surface p-3 sm:p-5 lg:p-6 xl:max-w-[1180px] xl:p-7">
      <div className="group/auth overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-[0_18px_50px_rgba(3,8,31,0.08)] transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(3,8,31,0.14)] lg:grid lg:grid-cols-2">
        <div className="relative flex min-h-65 overflow-hidden bg-brand-ink px-6 py-7 text-white sm:px-8 sm:py-9 lg:min-h-[560px] lg:flex-col lg:justify-between lg:px-12 lg:py-12 xl:min-h-[620px] xl:px-16 xl:py-14">
          <div className="auth-float-primary absolute -right-20 -top-15 size-55 rounded-full bg-brand/95 transition-transform duration-700 group-hover/auth:scale-110 lg:-right-24 lg:-top-20 lg:size-72 xl:size-80" />
          <div className="auth-float-secondary absolute -bottom-22.5 -left-15 size-45 rounded-full bg-brand/30 transition-transform duration-700 group-hover/auth:scale-110 lg:-bottom-28 lg:-left-20 lg:size-60 xl:size-68" />

          <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-12 md:gap-0">
            <p className="w-fit text-[20px] font-semibold tracking-[-0.03em] text-white transition-transform duration-300 motion-safe:group-hover/auth:translate-x-1 xl:text-[24px]">
              donesi<span className="text-brand">.me</span>
            </p>

            <div className="lg:my-auto">
              <h1 className="max-w-80 text-[22px] font-medium leading-[1.3] lg:text-[28px] xl:max-w-100 xl:text-[34px]">
                {content.eyebrow}
              </h1>
              <p className="mt-2 max-w-80 text-[13px] leading-[1.65] text-white/70 sm:text-[14px] lg:mt-4 lg:text-[15px] xl:max-w-100 xl:text-[17px] xl:leading-7">
                {content.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-white/70 xl:text-[15px]">
              <MapPin aria-hidden="true" className="size-4 text-brand xl:size-5" />
              <span>{content.availabilityLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-120 flex-col bg-white px-6 py-7 sm:px-8 sm:py-9 lg:min-h-[560px] lg:px-12 lg:py-12 xl:min-h-[620px] xl:px-16 xl:py-14">
          <nav
            aria-label={content.authTabsLabel}
            className="mb-6 flex rounded-full bg-brand-surface p-0.75 xl:mb-9"
          >
            <Link
              href={`/${lang}/login`}
              aria-current={!isRegister ? "page" : undefined}
              className={`${tabClassName} ${
                !isRegister
                  ? "bg-brand text-white shadow-[0_5px_14px_rgba(252,138,6,0.24)]"
                  : "text-brand-ink/55 hover:text-brand-ink"
              }`}
            >
              {content.loginTabLabel}
            </Link>
            <Link
              href={`/${lang}/register`}
              aria-current={isRegister ? "page" : undefined}
              className={`${tabClassName} ${
                isRegister
                  ? "bg-brand text-white shadow-[0_5px_14px_rgba(252,138,6,0.24)]"
                  : "text-brand-ink/55 hover:text-brand-ink"
              }`}
            >
              {content.registerTabLabel}
            </Link>
          </nav>

          <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
            <div className="space-y-3.5 xl:space-y-5">
              {isRegister ? (
                <label className="block">
                  <span className="mb-1 block text-[13px] text-brand-ink/55 xl:mb-2 xl:text-[14px]">
                {content.nameLabel}
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={fields.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder={content.namePlaceholder}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                  {fieldErrors.name ? (
                    <span id="name-error" className="mt-1.5 block text-[12px] text-red-700">
                      {fieldErrors.name}
                    </span>
                  ) : null}
                </label>
              ) : null}

              <label className="block">
                <span className="mb-1 block text-[13px] text-brand-ink/55 xl:mb-2 xl:text-[14px]">
                  {content.emailLabel}
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder={content.emailPlaceholder}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                  className={inputClassName}
                />
                {fieldErrors.email ? (
                  <span id="email-error" className="mt-1.5 block text-[12px] text-red-700">
                    {fieldErrors.email}
                  </span>
                ) : null}
              </label>

              {isRegister ? (
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-[13px] text-brand-ink/55 xl:mb-2 xl:text-[14px]">
                    {content.phoneLabel}
                    <span className="text-brand-ink/35">
                      ({content.phoneOptionalLabel})
                    </span>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={fields.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={content.phonePlaceholder}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                  {fieldErrors.phone ? (
                    <span id="phone-error" className="mt-1.5 block text-[12px] text-red-700">
                      {fieldErrors.phone}
                    </span>
                  ) : null}
                </label>
              ) : null}

              <label className="block">
                <span className="mb-1 block text-[13px] text-brand-ink/55 xl:mb-2 xl:text-[14px]">
                  {content.passwordLabel}
                </span>
                <span className="relative block">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    value={fields.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder={content.passwordPlaceholder}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    disabled={isSubmitting}
                    className={`${inputClassName} pr-11 xl:pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={
                      isPasswordVisible
                        ? content.hidePasswordLabel
                        : content.showPasswordLabel
                    }
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
                    disabled={isSubmitting}
                    className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-brand-ink/40 transition-[color,background-color,transform] hover:bg-brand/10 hover:text-brand motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed xl:right-2"
                  >
                    {isPasswordVisible ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </span>
                {fieldErrors.password ? (
                  <span id="password-error" className="mt-1.5 block text-[12px] text-red-700">
                    {fieldErrors.password}
                  </span>
                ) : null}
              </label>
            </div>

            {!isRegister ? (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  disabled
                  title={content.unavailableLabel}
                  className="cursor-not-allowed text-[12px] font-medium text-brand xl:text-[13px]"
                >
                  {content.forgotPasswordLabel}
                </button>
              </div>
            ) : null}

            {formError ? (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800"
              >
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || status === "loading"}
              className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-brand text-[13px] font-medium text-white shadow-[0_8px_18px_rgba(252,138,6,0.18)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#E77D00] hover:shadow-[0_12px_24px_rgba(252,138,6,0.28)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-brand-ink/25 disabled:shadow-none xl:h-12 xl:text-[14px]"
            >
              {isSubmitting ? content.submittingLabel : content.submitLabel}
            </button>

            <div className="my-3.5 flex items-center gap-2.5">
              <div className="h-px flex-1 bg-brand-ink/10" />
              <span className="text-[12px] text-brand-ink/40">
                {content.orLabel}
              </span>
              <div className="h-px flex-1 bg-brand-ink/10" />
            </div>

            <button
              type="button"
              disabled
              title={content.unavailableLabel}
              className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-brand-ink/15 bg-white text-[13px] font-medium text-brand-ink/70 xl:h-12 xl:text-[14px]"
            >
              <FcGoogle aria-hidden="true" className="size-4" />
              {content.googleLabel}
            </button>

            <p className="mt-auto pt-4 text-center text-[12px] text-brand-ink/45 xl:text-[13px]">
              {content.alternatePrompt}{" "}
              <Link
                href={`/${lang}/${isRegister ? "login" : "register"}`}
                className="font-medium text-brand transition-colors hover:text-[#E77D00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {content.alternateLinkLabel}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
