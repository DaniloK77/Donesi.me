"use client";

import { BadgeCheck, Mail, Phone, ShieldCheck, User } from "lucide-react";
import type { ProfileContent } from "@/utils/getAuthDictionary";
import { useAuth } from "./AuthProvider";

export default function ProfilePanel({ content }: { content: ProfileContent }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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
        <div className="grid gap-4 rounded-3xl border border-brand-ink/8 bg-white p-6 shadow-[0_16px_50px_rgba(3,8,31,0.07)] sm:grid-cols-2 sm:p-8">
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
        </div>
      </div>
    </section>
  );
}
