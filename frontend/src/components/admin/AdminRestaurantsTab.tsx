"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  Utensils,
  X,
} from "lucide-react";

import type { Lang } from "@/utils/getDictionary";
import type { AdminDictionary } from "@/utils/getAdminDictionary";
import {
  AdminApiError,
  createMenuCategory,
  createMenuItem,
  deleteMenuCategory,
  deleteMenuItem,
  updateMenuItem,
  uploadMenuImage,
} from "./api";
import { isUsableImageUrl } from "@/lib/menu-image";
import type { AdminMenuItem, AdminRestaurant } from "./types";

const fill = (template: string, name: string) => template.replace("{name}", name);

type ItemDraft = {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
};

const EMPTY_DRAFT: ItemDraft = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
};

/**
 * Shows the card the customer will see, built from what has been typed so far,
 * so the administrator does not have to open the restaurant page to check.
 */
function MenuCardPreview({
  draft,
  label,
  priceFormatter,
}: {
  draft: ItemDraft;
  label: string;
  priceFormatter: Intl.NumberFormat;
}) {
  const price = Number(draft.price);
  const hasImage = isUsableImageUrl(draft.imageUrl);

  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/40">
        {label}
      </p>
      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
        <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand/10 text-brand">
          {hasImage ? (
            // Remote hosts are not whitelisted for next/image — see lib/menu-image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imageUrl.trim()}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Utensils aria-hidden="true" className="size-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-brand-ink">
            {draft.name.trim() || "—"}
          </p>
          {draft.description.trim() ? (
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-brand-ink/60">
              {draft.description.trim()}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-[15px] font-bold text-brand">
          {Number.isFinite(price) && price > 0 ? priceFormatter.format(price) : "—"}
        </p>
      </div>
    </div>
  );
}


/**
 * Picks the item image either by uploading a file or by pasting a link. The
 * upload happens immediately so the preview below reflects the stored file,
 * not a local blob that would vanish on save.
 */
function ImagePicker({
  restaurantId,
  draft,
  setDraft,
  copy,
}: {
  restaurantId: string;
  draft: ItemDraft;
  setDraft: (draft: ItemDraft) => void;
  copy: AdminDictionary["restaurants"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const { url } = await uploadMenuImage(file);
      setDraft({ ...draft, imageUrl: url });
    } catch (failure) {
      const code = failure instanceof AdminApiError ? failure.code : undefined;
      const messages: Record<string, string> = {
        IMAGE_TOO_LARGE: copy.imageTooLarge,
        UNSUPPORTED_IMAGE_TYPE: copy.unsupportedImageType,
      };
      setUploadError((code && messages[code]) || copy.uploadFailed);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          id={`menu-image-${restaurantId}-${draft.name || "new"}`}
          onChange={(event) => void pick(event.target.files?.[0])}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full border border-brand-ink/15 px-3.5 py-2 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : (
            <Upload aria-hidden="true" className="size-3.5" />
          )}
          {isUploading ? copy.uploadingLabel : copy.uploadImageLabel}
        </button>

        <span className="text-[11px] text-brand-ink/45">
          {copy.orPasteLinkLabel}
        </span>

        {draft.imageUrl ? (
          <button
            type="button"
            onClick={() => setDraft({ ...draft, imageUrl: "" })}
            className="text-[11px] font-semibold text-red-700 hover:underline"
          >
            {copy.removeImageLabel}
          </button>
        ) : null}
      </div>

      {uploadError ? (
        <p role="alert" className="mt-1 text-[11px] text-red-700">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}

export default function AdminRestaurantsTab({
  lang,
  content,
  restaurants,
  onRestaurantsChange,
}: {
  lang: Lang;
  content: AdminDictionary;
  restaurants: AdminRestaurant[] | null;
  onRestaurantsChange: (restaurants: AdminRestaurant[]) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ItemDraft>(EMPTY_DRAFT);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locale = lang === "me" ? "sr-Latn-ME" : "en-IE";
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  });
  const copy = content.restaurants;
  const list = restaurants ?? [];

  /** Applies a change to one restaurant's menu in the loaded list. */
  const patchRestaurant = (
    restaurantId: string,
    update: (restaurant: AdminRestaurant) => AdminRestaurant,
  ) =>
    onRestaurantsChange(
      list.map((restaurant) =>
        restaurant.id === restaurantId ? update(restaurant) : restaurant,
      ),
    );

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);

    try {
      await action();
    } catch {
      setError(copy.actionError);
    } finally {
      setBusy(false);
    }
  };

  const countItems = (restaurant: AdminRestaurant) =>
    restaurant.menuCategories.reduce((sum, c) => sum + c.items.length, 0);

  const startEditingItem = (item: AdminMenuItem) => {
    setEditingItemId(item.id);
    setDraft({
      name: item.name,
      price: String(item.price),
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
    });
  };

  const saveItem = (restaurantId: string, itemId: string) =>
    void run(async () => {
      const updated = await updateMenuItem(restaurantId, itemId, {
        name: draft.name.trim(),
        price: Number(draft.price),
        description: draft.description.trim() || null,
        imageUrl: draft.imageUrl.trim() || null,
      });

      patchRestaurant(restaurantId, (restaurant) => ({
        ...restaurant,
        menuCategories: restaurant.menuCategories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? updated : item,
          ),
        })),
      }));
      setEditingItemId(null);
    });

  const toggleAvailability = (restaurantId: string, item: AdminMenuItem) =>
    void run(async () => {
      const updated = await updateMenuItem(restaurantId, item.id, {
        isAvailable: !item.isAvailable,
      });

      patchRestaurant(restaurantId, (restaurant) => ({
        ...restaurant,
        menuCategories: restaurant.menuCategories.map((category) => ({
          ...category,
          items: category.items.map((entry) =>
            entry.id === item.id ? updated : entry,
          ),
        })),
      }));
    });

  const removeItem = (restaurantId: string, item: AdminMenuItem) => {
    if (!window.confirm(fill(copy.deleteItemConfirm, item.name))) {
      return;
    }

    void run(async () => {
      await deleteMenuItem(restaurantId, item.id);
      patchRestaurant(restaurantId, (restaurant) => {
        const next = {
          ...restaurant,
          menuCategories: restaurant.menuCategories.map((category) => ({
            ...category,
            items: category.items.filter((entry) => entry.id !== item.id),
          })),
        };
        return { ...next, menuItemCount: countItems(next) };
      });
    });
  };

  const addItem = (restaurantId: string, categoryId: string) =>
    void run(async () => {
      const created = await createMenuItem(restaurantId, {
        menuCategoryId: categoryId,
        name: draft.name.trim(),
        price: Number(draft.price),
        description: draft.description.trim() || null,
        imageUrl: draft.imageUrl.trim() || null,
      });

      patchRestaurant(restaurantId, (restaurant) => {
        const next = {
          ...restaurant,
          menuCategories: restaurant.menuCategories.map((category) =>
            category.id === categoryId
              ? { ...category, items: [...category.items, created] }
              : category,
          ),
        };
        return { ...next, menuItemCount: countItems(next) };
      });
      setAddingToCategory(null);
      setDraft(EMPTY_DRAFT);
    });

  const addCategory = (restaurantId: string) =>
    void run(async () => {
      const created = await createMenuCategory(restaurantId, newCategory.trim());

      patchRestaurant(restaurantId, (restaurant) => ({
        ...restaurant,
        menuCategories: [...restaurant.menuCategories, created],
      }));
      setNewCategory("");
    });

  const removeCategory = (restaurantId: string, categoryId: string, name: string) => {
    if (!window.confirm(fill(copy.deleteCategoryConfirm, name))) {
      return;
    }

    void run(async () => {
      await deleteMenuCategory(restaurantId, categoryId);
      patchRestaurant(restaurantId, (restaurant) => {
        const next = {
          ...restaurant,
          menuCategories: restaurant.menuCategories.filter(
            (category) => category.id !== categoryId,
          ),
        };
        return { ...next, menuItemCount: countItems(next) };
      });
    });
  };

  if (restaurants === null) {
    return (
      <div
        role="status"
        className="flex min-h-40 items-center justify-center rounded-3xl bg-brand-surface text-[15px] font-semibold text-brand-ink/60"
      >
        {content.loadingLabel}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <p className="rounded-3xl border border-brand-ink/8 bg-brand-surface px-6 py-10 text-center text-[14px] text-brand-ink/60">
        {copy.emptyMessage}
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-[13px] text-brand-ink outline-none focus:border-brand";

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </p>
      ) : null}

      {restaurants.map((restaurant) => {
        const isExpanded = expandedId === restaurant.id;
        const isEditing = editingId === restaurant.id;

        return (
          <article
            key={restaurant.id}
            className="overflow-hidden rounded-2xl border border-brand-ink/8 bg-white"
          >
            <div className="flex flex-wrap items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-bold text-brand-ink">
                  {restaurant.name}
                </h3>
                {/* Metadata is reference material; it only earns space on wider screens. */}
                <p className="mt-1 hidden flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-brand-ink/55 sm:flex">
                  <span>{restaurant.category}</span>
                  <span className="flex items-center gap-1">
                    <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {restaurant.address}
                  </span>
                  <span>
                    {copy.deliveryTimeLabel}: {restaurant.deliveryTimeMin} {copy.minutesShort}
                  </span>
                </p>
                <p className="mt-1 hidden font-mono text-[11px] text-brand-ink/40 lg:block">
                  {restaurant.latitude.toFixed(5)}, {restaurant.longitude.toFixed(5)}
                </p>
              </div>

              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => {
                  setExpandedId(isExpanded ? null : restaurant.id);
                  setEditingId(null);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-ink/12 px-3 py-2 text-[12px] font-semibold text-brand-ink transition-colors hover:border-brand hover:text-brand"
              >
                {restaurant.menuItemCount}
                <span className="hidden sm:inline">{copy.menuItemsLabel}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {isExpanded ? (
              <div className="border-t border-brand-ink/8 bg-brand-surface p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(isEditing ? null : restaurant.id);
                      setEditingItemId(null);
                      setAddingToCategory(null);
                    }}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                      isEditing
                        ? "bg-brand-ink text-white"
                        : "border border-brand-ink/12 text-brand-ink hover:border-brand hover:text-brand"
                    }`}
                  >
                    <Pencil aria-hidden="true" className="size-3.5" />
                    {isEditing ? copy.doneEditingLabel : copy.editMenuLabel}
                  </button>

                  {busy ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin text-brand-ink/40" />
                  ) : null}
                </div>

                {restaurant.menuCategories.map((category) => (
                  <div key={category.id} className="mb-5 last:mb-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
                        {category.name}
                      </h4>
                      {isEditing ? (
                        <button
                          type="button"
                          aria-label={`${copy.deleteCategoryLabel}: ${category.name}`}
                          onClick={() => removeCategory(restaurant.id, category.id, category.name)}
                          className="text-[11px] font-semibold text-red-700 hover:underline"
                        >
                          {copy.deleteCategoryLabel}
                        </button>
                      ) : null}
                    </div>

                    <ul className="mt-2 space-y-1.5">
                      {category.items.map((item) =>
                        isEditing && editingItemId === item.id ? (
                          <li key={item.id} className="rounded-xl border border-brand/30 bg-white p-3">
                            <div className="grid gap-2 sm:grid-cols-[1fr_110px]">
                              <input
                                aria-label={copy.itemNamePlaceholder}
                                value={draft.name}
                                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                                placeholder={copy.itemNamePlaceholder}
                                className={fieldClass}
                              />
                              <input
                                aria-label={copy.itemPricePlaceholder}
                                type="number"
                                step="0.01"
                                min="0"
                                value={draft.price}
                                onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                                placeholder={copy.itemPricePlaceholder}
                                className={fieldClass}
                              />
                            </div>
                            <input
                              aria-label={copy.itemDescriptionPlaceholder}
                              value={draft.description}
                              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                              placeholder={copy.itemDescriptionPlaceholder}
                              className={`${fieldClass} mt-2`}
                            />
                            <ImagePicker
                              restaurantId={restaurant.id}
                              draft={draft}
                              setDraft={setDraft}
                              copy={copy}
                            />
                            <input
                              aria-label={copy.itemImagePlaceholder}
                              value={draft.imageUrl}
                              onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
                              placeholder={copy.itemImagePlaceholder}
                              className={`${fieldClass} mt-2`}
                            />
                            {draft.imageUrl.trim() && !isUsableImageUrl(draft.imageUrl) ? (
                              <p className="mt-1 text-[11px] text-red-700">{copy.imageInvalid}</p>
                            ) : null}
                            <MenuCardPreview
                              draft={draft}
                              label={copy.imagePreviewLabel}
                              priceFormatter={priceFormatter}
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                disabled={busy || !draft.name.trim() || !draft.price}
                                onClick={() => saveItem(restaurant.id, item.id)}
                                className="rounded-full bg-brand px-4 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
                              >
                                {copy.saveLabel}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="rounded-full border border-brand-ink/12 px-4 py-1.5 text-[12px] font-semibold text-brand-ink"
                              >
                                {copy.cancelLabel}
                              </button>
                            </div>
                          </li>
                        ) : (
                          <li key={item.id} className="flex items-center justify-between gap-3 text-[13px]">
                            <span className="min-w-0 flex-1 truncate text-brand-ink">
                              {item.name}
                              {!item.isAvailable ? (
                                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                                  {copy.unavailableLabel}
                                </span>
                              ) : null}
                            </span>
                            <span className="shrink-0 font-semibold text-brand-ink">
                              {priceFormatter.format(item.price)}
                            </span>
                            {isEditing ? (
                              <span className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  aria-label={item.isAvailable ? copy.markUnavailableLabel : copy.markAvailableLabel}
                                  title={item.isAvailable ? copy.markUnavailableLabel : copy.markAvailableLabel}
                                  onClick={() => toggleAvailability(restaurant.id, item)}
                                  className="flex size-7 items-center justify-center rounded-full border border-brand-ink/12 text-brand-ink hover:border-brand hover:text-brand"
                                >
                                  <X aria-hidden="true" className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`${copy.editLabel}: ${item.name}`}
                                  onClick={() => startEditingItem(item)}
                                  className="flex size-7 items-center justify-center rounded-full border border-brand-ink/12 text-brand-ink hover:border-brand hover:text-brand"
                                >
                                  <Pencil aria-hidden="true" className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`${copy.deleteItemLabel}: ${item.name}`}
                                  onClick={() => removeItem(restaurant.id, item)}
                                  className="flex size-7 items-center justify-center rounded-full border border-brand-ink/12 text-red-700 hover:border-red-300 hover:bg-red-50"
                                >
                                  <Trash2 aria-hidden="true" className="size-3.5" />
                                </button>
                              </span>
                            ) : null}
                          </li>
                        ),
                      )}
                    </ul>

                    {isEditing ? (
                      addingToCategory === category.id ? (
                        <div className="mt-3 rounded-xl border border-brand/30 bg-white p-3">
                          <div className="grid gap-2 sm:grid-cols-[1fr_110px]">
                            <input
                              aria-label={copy.itemNamePlaceholder}
                              value={draft.name}
                              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                              placeholder={copy.itemNamePlaceholder}
                              className={fieldClass}
                            />
                            <input
                              aria-label={copy.itemPricePlaceholder}
                              type="number"
                              step="0.01"
                              min="0"
                              value={draft.price}
                              onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                              placeholder={copy.itemPricePlaceholder}
                              className={fieldClass}
                            />
                          </div>
                          <input
                            aria-label={copy.itemDescriptionPlaceholder}
                            value={draft.description}
                            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                            placeholder={copy.itemDescriptionPlaceholder}
                            className={`${fieldClass} mt-2`}
                          />
                          <ImagePicker
                            restaurantId={restaurant.id}
                            draft={draft}
                            setDraft={setDraft}
                            copy={copy}
                          />
                          <input
                            aria-label={copy.itemImagePlaceholder}
                            value={draft.imageUrl}
                            onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
                            placeholder={copy.itemImagePlaceholder}
                            className={`${fieldClass} mt-2`}
                          />
                          {draft.imageUrl.trim() && !isUsableImageUrl(draft.imageUrl) ? (
                            <p className="mt-1 text-[11px] text-red-700">{copy.imageInvalid}</p>
                          ) : null}
                          <MenuCardPreview
                            draft={draft}
                            label={copy.imagePreviewLabel}
                            priceFormatter={priceFormatter}
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              disabled={busy || !draft.name.trim() || !draft.price}
                              onClick={() => addItem(restaurant.id, category.id)}
                              className="rounded-full bg-brand px-4 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
                            >
                              {copy.saveLabel}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddingToCategory(null)}
                              className="rounded-full border border-brand-ink/12 px-4 py-1.5 text-[12px] font-semibold text-brand-ink"
                            >
                              {copy.cancelLabel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddingToCategory(category.id);
                            setDraft(EMPTY_DRAFT);
                          }}
                          className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:underline"
                        >
                          <Plus aria-hidden="true" className="size-3.5" />
                          {copy.addItemLabel}
                        </button>
                      )
                    ) : null}
                  </div>
                ))}

                {isEditing ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-brand-ink/8 pt-4">
                    <input
                      aria-label={copy.categoryNamePlaceholder}
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      placeholder={copy.categoryNamePlaceholder}
                      className={`${fieldClass} sm:w-56`}
                    />
                    <button
                      type="button"
                      disabled={busy || !newCategory.trim()}
                      onClick={() => addCategory(restaurant.id)}
                      className="flex items-center gap-1.5 rounded-full bg-brand-ink px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
                    >
                      <Plus aria-hidden="true" className="size-3.5" />
                      {copy.addCategoryLabel}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
