export interface FeaturedItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  customization?: MenuItemCustomization;
}

export interface CustomizableItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  customization?: MenuItemCustomization;
}

export interface LocalizedText {
  en: string;
  me: string;
}

export interface MenuItemCustomizationOption {
  id: string;
  label: LocalizedText;
  extraPrice?: number;
}

export interface MenuItemCustomizationGroup {
  id: string;
  label: LocalizedText;
  icon?: string;
  options: MenuItemCustomizationOption[];
}

export interface MenuItemCustomization {
  enabled: boolean;
  profileKey: string;
  maxAddOns: number;
  groups: MenuItemCustomizationGroup[];
  needsCutleryDefault: boolean;
  specialRequestMaxLength: number;
}

export interface MenuItem extends FeaturedItem {
  description?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  weeklyDiscountPercent?: number | null;
  discountWeekStart?: string | null;
  displayOrder: number;
  customization?: MenuItemCustomization;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface RestaurantReview {
  id: string;
  authorName: string;
  authorLocation?: string | null;
  authorImageUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RestaurantBannerInfo {
  slug: string;
  name: string;
  category: string;
  rating: number;
  deliveryTimeMin: number;
  logoUrl: string;
  coverImageUrl?: string | null;
  address: string;
}

export interface RestaurantMenu extends RestaurantBannerInfo {
  id: string;
  city: string;
  featuredItems: FeaturedItem[];
  menuCategories: MenuCategory[];
  reviews: RestaurantReview[];
}
