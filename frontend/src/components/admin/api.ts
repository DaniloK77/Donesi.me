import type { OrderStatus } from "@/components/orders/types";
import type {
  AdminMenuCategory,
  AdminMenuItem,
  AdminOrder,
  AdminOverview,
  AdminRestaurant,
  AdminUser,
  Courier,
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

export function deleteUser(userId: string) {
  return request<void>(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export function updateCourier(
  courierId: string,
  patch: { isActive?: boolean; name?: string; phone?: string },
) {
  return request<Courier>(`/couriers/${encodeURIComponent(courierId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteCourier(courierId: string) {
  return request<void>(`/couriers/${encodeURIComponent(courierId)}`, {
    method: "DELETE",
  });
}

/**
 * Uploads an image file and returns the URL to store on a menu item.
 *
 * FormData sets its own multipart boundary, so this bypasses the JSON helper
 * rather than letting it force a content-type header.
 */
export async function uploadMenuImage(file: File): Promise<{ url: string }> {
  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`${apiUrl}/api/admin/uploads/menu-image`, {
    method: "POST",
    credentials: "include",
    body,
  });

  const payload = (await response.json().catch(() => null)) as
    | { url?: string; code?: string; error?: string }
    | null;

  if (!response.ok || !payload?.url) {
    throw new AdminApiError(
      payload?.error ?? "Upload failed.",
      response.status,
      payload?.code,
    );
  }

  return { url: payload.url };
}

/* ---------------------------------------------------------------- *
 * Menu editing
 * ---------------------------------------------------------------- */

const menuPath = (restaurantId: string, suffix: string) =>
  `/restaurants/${encodeURIComponent(restaurantId)}/${suffix}`;

export function createMenuCategory(restaurantId: string, name: string) {
  return request<AdminMenuCategory>(menuPath(restaurantId, "menu-categories"), {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function renameMenuCategory(
  restaurantId: string,
  categoryId: string,
  name: string,
) {
  return request<AdminMenuCategory>(
    menuPath(restaurantId, `menu-categories/${encodeURIComponent(categoryId)}`),
    { method: "PATCH", body: JSON.stringify({ name }) },
  );
}

export function deleteMenuCategory(restaurantId: string, categoryId: string) {
  return request<void>(
    menuPath(restaurantId, `menu-categories/${encodeURIComponent(categoryId)}`),
    { method: "DELETE" },
  );
}

export function createMenuItem(
  restaurantId: string,
  input: {
    menuCategoryId: string;
    name: string;
    price: number;
    description?: string | null;
    imageUrl?: string | null;
    isAvailable?: boolean;
  },
) {
  return request<AdminMenuItem>(menuPath(restaurantId, "menu-items"), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMenuItem(
  restaurantId: string,
  itemId: string,
  patch: {
    name?: string;
    price?: number;
    description?: string | null;
    imageUrl?: string | null;
    isAvailable?: boolean;
  },
) {
  return request<AdminMenuItem>(
    menuPath(restaurantId, `menu-items/${encodeURIComponent(itemId)}`),
    { method: "PATCH", body: JSON.stringify(patch) },
  );
}

export function deleteMenuItem(restaurantId: string, itemId: string) {
  return request<void>(
    menuPath(restaurantId, `menu-items/${encodeURIComponent(itemId)}`),
    { method: "DELETE" },
  );
}

export function listUsers() {
  return request<AdminUser[]>("/users");
}

export function listCouriers() {
  return request<CourierWithLoad[]>("/couriers");
}
