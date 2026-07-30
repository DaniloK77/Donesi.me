"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, Gift, Users } from "lucide-react";

import type { InviteFriendsSectionProps } from "./types";

export default function InviteFriendsSection({
  content,
}: InviteFriendsSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(content.code);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <section
      aria-labelledby="invite-friends-title"
      className="special-reveal mx-auto mt-24 grid min-h-145 w-[calc(100%-2rem)] min-w-300 max-w-382 grid-cols-[0.94fr_1.06fr] overflow-hidden rounded-[32px] bg-[#FBE3D1]"
    >
      <div className="relative min-h-145 overflow-hidden">
        <Image
          src="/images/special-offers/invite-friends.jpg"
          alt={content.imageAlt}
          fill
          sizes="(min-width: 1400px) 700px, 47vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FBE3D1]/95" />
      </div>

      <div className="relative flex flex-col justify-center px-18 py-14">
        <div className="pointer-events-none absolute -right-28 -top-32 size-80 rounded-full bg-brand/15 blur-3xl" />
        <div className="relative">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand">
            {content.eyebrow}
          </p>
          <h2
            id="invite-friends-title"
            className="mt-3 max-w-180 text-[43px] font-bold leading-tight tracking-[-0.025em] text-brand-ink"
          >
            {content.title}
          </h2>
          <p className="mt-5 max-w-180 text-[16px] leading-7 text-brand-ink/65">
            {content.description}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-brand-ink/8 bg-white/70 p-4">
              <Users aria-hidden="true" className="size-6 text-brand" />
              <p className="mt-3 text-[13px] font-semibold leading-5 text-brand-ink">
                {content.friendBenefit}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-ink/8 bg-white/70 p-4">
              <Gift aria-hidden="true" className="size-6 text-brand" />
              <p className="mt-3 text-[13px] font-semibold leading-5 text-brand-ink">
                {content.yourBenefit}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-ink/45">
              {content.codeLabel}
            </p>
            <div className="mt-2 flex h-16 items-center rounded-2xl border-2 border-dashed border-brand/35 bg-white p-1.5 pl-6">
              <code className="flex-1 text-[20px] font-bold tracking-[0.12em] text-brand-ink">
                {content.code}
              </code>
              <button
                type="button"
                onClick={() => void copyInviteCode()}
                className={`flex h-full min-w-43 items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-bold text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isCopied
                    ? "bg-brand-green"
                    : "bg-brand hover:-translate-y-0.5 hover:bg-brand-hover"
                }`}
              >
                {isCopied ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <Copy aria-hidden="true" className="size-4" />
                )}
                {isCopied ? content.copiedLabel : content.copyLabel}
              </button>
            </div>
            <p className="mt-3 text-[12px] text-brand-ink/45">
              {content.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
