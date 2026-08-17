import type { UserRole } from "@/components/auth/types";
import type { Order, OrderStatus } from "@/components/orders/types";

export type CourierVehicle = "SCOOTER" | "BICYCLE" | "CAR";

export type Courier = {
  id: string;
  name: string;
  phone: string;
  vehicle: CourierVehicle;
  rating: number;
  isActive: boolean;
};

export type CourierWithLoad = Courier & {
  activeDeliveries: number;
};

export type AdminOrderCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

/** An order as the admin panel sees it — the customer's order plus who placed it. */
export type AdminOrder = Order & {
  customer: AdminOrderCustomer;
};

export type AdminOverview = {
  orders: {
    total: number;
    byStatus: Partial<Record<OrderStatus, number>>;
  };
  restaurants: number;
  users: number;
  couriers: number;
};

export type AdminMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
};

export type AdminMenuCategory = {
  id: string;
  name: string;
  items: AdminMenuItem[];
};

export type AdminRestaurant = {
  id: string;
  name: string;
  slug: string;
  category: string;
  rating: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  deliveryTimeMin: number;
  logoUrl: string;
  menuItemCount: number;
  menuCategories: AdminMenuCategory[];
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  orderCount: number;
};
