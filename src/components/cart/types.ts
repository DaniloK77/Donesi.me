export interface CartRestaurant {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  restaurant: CartRestaurant;
  customization?: {
    selectedAddOns: string[];
    selectedAddOnDetails?: Array<{
      id: string;
      label: {
        en: string;
        me: string;
      };
      extraPrice?: number;
    }>;
    needsCutlery: boolean;
    specialRequest: string;
    profileKey?: string;
  } | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}
