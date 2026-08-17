"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { ProtectedRoute, useAuth } from "@/components/auth";
import type { Lang } from "@/utils/getDictionary";
import type { AdminDictionary } from "@/utils/getAdminDictionary";

/**
 * Client-side half of the admin guard: signed-out visitors are sent to login by
 * ProtectedRoute, signed-in non-admins get a clear refusal. The API enforces
 * the same rule with requireRole("ADMIN"), so this is presentation only.
 */
function AdminOnly({
  children,
  lang,
  content,
}: {
  children: React.ReactNode;
  lang: Lang;
  content: AdminDictionary;
}) {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return (
      <section className="mx-auto w-[calc(100%-2rem)] max-w-382">
        <div className="flex flex-col items-center rounded-3xl border border-brand-ink/8 bg-brand-surface px-8 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-5 text-[22px] font-bold text-brand-ink">
            {content.forbiddenTitle}
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-brand-ink/60">
            {content.forbiddenMessage}
          </p>
          <Link
            href={`/${lang}`}
            className="mt-6 rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {content.backHomeLabel}
          </Link>
        </div>
      </section>
    );
  }

  return children;
}

export default function AdminRoute({
  children,
  lang,
  content,
}: {
  children: React.ReactNode;
  lang: Lang;
  content: AdminDictionary;
}) {
  return (
    <ProtectedRoute lang={lang} loadingLabel={content.loadingLabel}>
      <AdminOnly lang={lang} content={content}>
        {children}
      </AdminOnly>
    </ProtectedRoute>
  );
}
