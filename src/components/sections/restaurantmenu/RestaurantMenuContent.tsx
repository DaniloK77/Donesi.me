"use client";

import { useState } from "react";
import { useCart } from "@/components/cart";
import type { Lang } from "@/utils/getDictionary";
import type { ItemCustomizationContent } from "@/utils/getRestaurantDictionary";
import ItemCustomizationModal, {
  type ItemCustomizationConfirmation,
} from "./ItemCustomizationModal";
import MenuList from "./MenuList";
import RestaurantBanner from "./RestaurantBanner";
import type {
  CustomizableItem,
  FeaturedItem,
  MenuCategory,
  RestaurantBannerInfo,
} from "./types";
import type { RestaurantMenuPageContent } from "@/utils/getRestaurantDictionary";

export interface RestaurantMenuContentProps {
  restaurant: RestaurantBannerInfo;
  featuredItems: FeaturedItem[];
  menuCategories: MenuCategory[];
  lang: Lang;
  bannerContent: RestaurantMenuPageContent;
  customizationContent: ItemCustomizationContent;
  menuTitle: string;
  categoryTranslations: Record<string, string>;
}

export default function RestaurantMenuContent({
  restaurant,
  featuredItems,
  menuCategories,
  lang,
  bannerContent,
  customizationContent,
  menuTitle,
  categoryTranslations,
}: RestaurantMenuContentProps) {
  const { addItem } = useCart();
  const [customizingItem, setCustomizingItem] =
    useState<CustomizableItem | null>(null);

  const requestCustomize = (item: CustomizableItem) => {
    setCustomizingItem(item);
  };

  const handleConfirm = async (
    payload: ItemCustomizationConfirmation,
  ) => {
    const added = await addItem(
      payload.menuItemId,
      1,
      payload.customization,
    );

    if (!added) {
      throw new Error("Unable to add item.");
    }
  };

  return (
    <>
      <RestaurantBanner
        restaurant={restaurant}
        featuredItems={featuredItems}
        lang={lang}
        content={bannerContent}
        categoryTranslations={categoryTranslations}
        onRequestCustomize={requestCustomize}
      />
      <MenuList
        categories={menuCategories}
        lang={lang}
        title={menuTitle}
        categoryTranslations={categoryTranslations}
        onRequestCustomize={requestCustomize}
      />
      {customizingItem ? (
        <ItemCustomizationModal
          menuItem={customizingItem}
          lang={lang}
          content={customizationContent}
          onClose={() => setCustomizingItem(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}
