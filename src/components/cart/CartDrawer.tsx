"use client";

import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { useEffect } from "react";
import type { Lang } from "@/utils/getDictionary";
import { useCart } from "./CartProvider";

const cartCopy = {
  en: {
    title: "Your cart",
    emptyTitle: "Your cart is empty",
    emptyMessage: "Add a menu item to start your order.",
    close: "Close cart",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    remove: "Remove item",
    clear: "Clear cart",
    subtotal: "Subtotal",
    checkout: "Checkout coming soon",
    unavailable: "Currently unavailable",
  },
  me: {
    title: "Tvoja korpa",
    emptyTitle: "Tvoja korpa je prazna",
    emptyMessage: "Dodaj proizvod iz menija da započneš narudžbu.",
    close: "Zatvori korpu",
    decrease: "Smanji količinu",
    increase: "Povećaj količinu",
    remove: "Ukloni proizvod",
    clear: "Isprazni korpu",
    subtotal: "Ukupno",
    checkout: "Plaćanje uskoro",
    unavailable: "Trenutno nedostupno",
  },
} as const;

export interface CartDrawerProps {
  lang: Lang;
}

export default function CartDrawer({ lang }: CartDrawerProps) {
  const {
    cart,
    subtotal,
    isOpen,
    error,
    closeCart,
    clearCart,
    updateQuantity,
    removeItem,
    isItemPending,
  } = useCart();
  const copy = cartCopy[lang];
  const priceFormatter = new Intl.NumberFormat(
    lang === "me" ? "sr-Latn-ME" : "en-IE",
    {
      style: "currency",
      currency: "EUR",
    },
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label={copy.close}
        onClick={closeCart}
        className="absolute inset-0 bg-brand-ink/55 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute bottom-0 right-0 top-0 flex w-full max-w-120 flex-col bg-white shadow-[-24px_0_60px_rgba(3,8,31,0.22)]"
      >
        <header className="flex min-h-21 items-center justify-between border-b border-black/10 px-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand text-white">
              <ShoppingBasket aria-hidden="true" className="size-6" />
            </span>
            <h2
              id="cart-drawer-title"
              className="text-[24px] font-semibold text-brand-ink"
            >
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label={copy.close}
            onClick={closeCart}
            className="flex size-11 items-center justify-center rounded-full bg-brand-ink/5 text-brand-ink transition-colors hover:bg-brand hover:text-white"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {error ? (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700"
            >
              {error}
            </p>
          ) : null}

          {!cart || cart.items.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <span className="flex size-20 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ShoppingBasket aria-hidden="true" className="size-9" />
              </span>
              <h3 className="mt-5 text-[20px] font-semibold text-brand-ink">
                {copy.emptyTitle}
              </h3>
              <p className="mt-2 max-w-70 text-[13px] leading-5 text-brand-ink/60">
                {copy.emptyMessage}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => {
                const isPending = isItemPending(item.menuItemId);

                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_8px_24px_rgba(3,8,31,0.05)]"
                  >
                    <div className="flex gap-4">
                      <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand/10 text-brand">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt=""
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        ) : (
                          <Utensils aria-hidden="true" className="size-7" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-brand/85">
                              {item.restaurant.name}
                            </p>
                            <h3 className="mt-1 text-[15px] font-semibold leading-5 text-brand-ink">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            aria-label={`${copy.remove}: ${item.name}`}
                            disabled={isPending}
                            onClick={() => void removeItem(item.menuItemId)}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-brand-ink/45 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </button>
                        </div>

                        {!item.isAvailable ? (
                          <p className="mt-2 text-[11px] font-medium text-red-600">
                            {copy.unavailable}
                          </p>
                        ) : null}

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="flex h-9 items-center rounded-full border border-brand-ink/15">
                            <button
                              type="button"
                              aria-label={`${copy.decrease}: ${item.name}`}
                              disabled={isPending}
                              onClick={() => {
                                if (item.quantity === 1) {
                                  void removeItem(item.menuItemId);
                                  return;
                                }

                                void updateQuantity(
                                  item.menuItemId,
                                  item.quantity - 1,
                                );
                              }}
                              className="flex size-9 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand/10 disabled:opacity-40"
                            >
                              <Minus aria-hidden="true" className="size-4" />
                            </button>
                            <span
                              aria-live="polite"
                              className="min-w-8 text-center text-[13px] font-semibold text-brand-ink"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`${copy.increase}: ${item.name}`}
                              disabled={isPending || item.quantity >= 99}
                              onClick={() =>
                                void updateQuantity(
                                  item.menuItemId,
                                  item.quantity + 1,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand/10 disabled:opacity-40"
                            >
                              <Plus aria-hidden="true" className="size-4" />
                            </button>
                          </div>
                          <p className="text-[16px] font-bold text-brand">
                            {priceFormatter.format(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-black/10 bg-brand-surface px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-5">
            <span className="text-[15px] font-medium text-brand-ink/65">
              {copy.subtotal}
            </span>
            <strong className="text-[25px] text-brand-ink">
              {priceFormatter.format(subtotal)}
            </strong>
          </div>
          <button
            type="button"
            disabled={!cart || cart.items.length === 0}
            className="mt-4 flex min-h-13 w-full items-center justify-center rounded-full bg-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-brand-ink/20"
          >
            {copy.checkout}
          </button>
          {cart && cart.items.length > 0 ? (
            <button
              type="button"
              onClick={() => void clearCart()}
              className="mt-3 w-full text-center text-[13px] font-medium text-brand-ink/55 underline underline-offset-4 transition-colors hover:text-red-600"
            >
              {copy.clear}
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}
