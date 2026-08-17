export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderDeliveryType = "DELIVERY" | "PICKUP";

/** Cash on delivery is the only method the platform supports today. */
export type PaymentMethod = "CASH_ON_DELIVERY";

export type CancelledBy = "CUSTOMER" | "ADMIN" | "RESTAURANT";

/** Why the customer cannot cancel, when they cannot. */
export type CancellationBlockReason =
  | "ALREADY_CANCELLED"
  | "TOO_FAR_ALONG"
  | "WINDOW_EXPIRED";

/**
 * Cancellation rights as decided by the API. The UI renders this, it does not
 * recompute it — the server is the only place the window is enforced.
 */
export type OrderCancellation = {
  canCancel: boolean;
  reason: CancellationBlockReason | null;
  windowMinutes: number;
  /** When the cancellation window closes. */
  expiresAt: string;
  cancelledAt: string | null;
  cancelledBy: CancelledBy | null;
  reasonText: string | null;
};

/** The delivery promise made when the order was accepted. */
export type OrderEstimate = {
  minutes: number;
  /** Absolute instant the estimate points at, for counting down. */
  at: string;
};

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
  paymentMethod: PaymentMethod;
  confirmedAt: string | null;
  estimate: OrderEstimate | null;
  cancellation: OrderCancellation;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  cartId: string;
  deliveryType?: OrderDeliveryType;
  addressId?: string;
};
