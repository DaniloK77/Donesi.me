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

export interface RestaurantMenu {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverImageUrl?: string | null;
  category: string;
  rating: number;
  address: string;
  city: string;
  deliveryTimeMin: number;
  featuredItems: FeaturedItem[];
  menuCategories: MenuCategory[];
}
