export interface FeaturedItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export interface MenuItem extends FeaturedItem {
  description?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
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
