"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/utils/getDictionary";
import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
  lang: Lang;
  loadingLabel: string;
};

export default function ProtectedRoute({
  children,
  lang,
  loadingLabel,
}: ProtectedRouteProps) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      const nextPath = encodeURIComponent(pathname);
      router.replace(`/${lang}/login?next=${nextPath}`);
    }
  }, [lang, pathname, router, status]);

  if (status !== "authenticated") {
    return (
      <div
        role="status"
        className="mx-auto flex min-h-80 w-[calc(100%-2rem)] max-w-382 items-center justify-center rounded-3xl bg-brand-surface text-[15px] font-semibold text-brand-ink/60"
      >
        {loadingLabel}
      </div>
    );
  }

  return children;
}
