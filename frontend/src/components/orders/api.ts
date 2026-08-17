import type { CreateOrderInput, Order } from "./types";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export class OrdersApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "OrdersApiError";
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as
    | (T & { code?: string; error?: string })
    | null;

  if (!response.ok) {
    throw new OrdersApiError(
      payload?.error ?? "Order request failed.",
      response.status,
      payload?.code,
    );
  }

  return payload as T;
}

export function createOrder(input: CreateOrderInput) {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listOrders() {
  return request<Order[]>("/api/orders");
}

export function getOrder(id: string) {
  return request<Order>(`/api/orders/${encodeURIComponent(id)}`);
}

/**
 * Cancels an order. The 5-minute window is enforced by the API, which answers
 * 409 with a `CANCELLATION_*` code once it has closed.
 */
export function cancelOrder(id: string, reason?: string) {
  return request<Order>(`/api/orders/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
