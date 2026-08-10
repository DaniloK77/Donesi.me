export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderDeliveryType = "DELIVERY" | "PICKUP";

export type OrderAddress = {
  label: string | null;
  street: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** The courier assigned to the order, once one has been assigned. */
export type OrderCourier = {
  id: string;
  name: string;
  phone: string;
  vehicle: "SCOOTER" | "BICYCLE" | "CAR";
  rating: number;
  isActive: boolean;
};

/** Pickup point of the order — the courier's starting location on the map. */
export type OrderRestaurant = {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  restaurantId: string;
  restaurantName: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  deliveryType: OrderDeliveryType;
  address: OrderAddress | null;
  restaurant: OrderRestaurant | null;
  courier: OrderCourier | null;
  subtotal: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  cartId: string;
  deliveryType?: OrderDeliveryType;
  addressId?: string;
};
