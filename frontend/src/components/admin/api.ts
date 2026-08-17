import type { OrderStatus } from "@/components/orders/types";
import type {
  AdminOrder,
  AdminOverview,
  AdminRestaurant,
  AdminUser,
  CourierWithLoad,
} from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export class AdminApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}/api/admin${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as
    | (T & { code?: string; error?: string })
    | null;

  if (!response.ok) {
    throw new AdminApiError(
      payload?.error ?? "Admin request failed.",
      response.status,
      payload?.code,
    );
  }

  return payload as T;
}

export function getOverview() {
  return request<AdminOverview>("/overview");
}

export function listAllOrders() {
  return request<AdminOrder[]>("/orders");
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return request<AdminOrder>(
    `/orders/${encodeURIComponent(orderId)}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

export function assignCourier(orderId: string, courierId: string | null) {
  return request<AdminOrder>(
    `/orders/${encodeURIComponent(orderId)}/courier`,
    { method: "PATCH", body: JSON.stringify({ courierId }) },
  );
}

export function deleteOrder(orderId: string) {
  return request<void>(`/orders/${encodeURIComponent(orderId)}`, {
    method: "DELETE",
  });
}

export function listRestaurants() {
  return request<AdminRestaurant[]>("/restaurants");
}

export function listUsers() {
  return request<AdminUser[]>("/users");
}

export function listCouriers() {
  return request<CourierWithLoad[]>("/couriers");
}
