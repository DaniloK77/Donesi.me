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
