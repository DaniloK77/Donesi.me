"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Cart } from "./types";

const CART_STORAGE_KEY = "donesi-cart-id";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

class CartApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "CartApiError";
    this.code = code;
    this.status = status;
  }
}

async function requestCart(path: string, init?: RequestInit): Promise<Cart> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as
    | (Cart & { code?: string; error?: string })
    | null;

  if (!response.ok || !payload) {
    throw new CartApiError(
      payload?.error ?? "Cart request failed.",
      response.status,
      payload?.code,
    );
  }

  return payload;
}

interface CartContextValue {
  cart: Cart | null;
  totalQuantity: number;
  subtotal: number;
  isHydrating: boolean;
  isOpen: boolean;
  error: string | null;
  addItem: (menuItemId: string, quantity?: number) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  removeItem: (menuItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  isItemPending: (menuItemId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(
    () => new Set(),
  );
  const cartIdRef = useRef<string | null>(null);
  const cartCreationRef = useRef<Promise<string> | null>(null);

  const resetCartIdentity = useCallback(() => {
    cartIdRef.current = null;
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart(null);
  }, []);

  const loadCart = useCallback(
    async (cartId: string) => {
      try {
        const storedCart = await requestCart(
          `/api/cart/${encodeURIComponent(cartId)}`,
        );
        cartIdRef.current = storedCart.id;
        setCart(storedCart);
      } catch (requestError) {
        if (
          requestError instanceof CartApiError &&
          requestError.status === 404
        ) {
          resetCartIdentity();
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load cart.",
        );
      }
    },
    [resetCartIdentity],
  );

  useEffect(() => {
    let isCancelled = false;

    const hydrateCart = async () => {
      const storedCartId = localStorage.getItem(CART_STORAGE_KEY);

      if (storedCartId) {
        cartIdRef.current = storedCartId;
        await loadCart(storedCartId);
      }

      if (!isCancelled) {
        setIsHydrating(false);
      }
    };

    void hydrateCart();

    return () => {
      isCancelled = true;
    };
  }, [loadCart]);

  const ensureCart = useCallback(async () => {
    if (cartIdRef.current) {
      return cartIdRef.current;
    }

    if (!cartCreationRef.current) {
      cartCreationRef.current = requestCart("/api/cart", {
        method: "POST",
      })
        .then((createdCart) => {
          cartIdRef.current = createdCart.id;
          localStorage.setItem(CART_STORAGE_KEY, createdCart.id);
          setCart(createdCart);

          return createdCart.id;
        })
        .finally(() => {
          cartCreationRef.current = null;
        });
    }

    return cartCreationRef.current;
  }, []);

  const markItemPending = useCallback(
    (menuItemId: string, isPending: boolean) => {
      setPendingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (isPending) {
          nextIds.add(menuItemId);
        } else {
          nextIds.delete(menuItemId);
        }

        return nextIds;
      });
    },
    [],
  );

  const addItem = useCallback(
    async (menuItemId: string, quantity = 1) => {
      markItemPending(menuItemId, true);
      setError(null);

      try {
        let cartId = await ensureCart();
        let updatedCart: Cart;

        try {
          updatedCart = await requestCart(
            `/api/cart/${encodeURIComponent(cartId)}/items`,
            {
              method: "POST",
              body: JSON.stringify({ menuItemId, quantity }),
            },
          );
        } catch (requestError) {
          if (
            !(requestError instanceof CartApiError) ||
            requestError.code !== "CART_NOT_FOUND"
          ) {
            throw requestError;
          }

          resetCartIdentity();
          cartId = await ensureCart();
          updatedCart = await requestCart(
            `/api/cart/${encodeURIComponent(cartId)}/items`,
            {
              method: "POST",
              body: JSON.stringify({ menuItemId, quantity }),
            },
          );
        }

        setCart(updatedCart);
        setIsOpen(true);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to add this item.",
        );
      } finally {
        markItemPending(menuItemId, false);
      }
    },
    [ensureCart, markItemPending, resetCartIdentity],
  );

  const updateQuantity = useCallback(
    async (menuItemId: string, quantity: number) => {
      const cartId = cartIdRef.current;

      if (!cartId) {
        return;
      }

      markItemPending(menuItemId, true);
      setError(null);

      try {
        const updatedCart = await requestCart(
          `/api/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(menuItemId)}`,
          {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
          },
        );
        setCart(updatedCart);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to update this item.",
        );
      } finally {
        markItemPending(menuItemId, false);
      }
    },
    [markItemPending],
  );

  const removeItem = useCallback(
    async (menuItemId: string) => {
      const cartId = cartIdRef.current;

      if (!cartId) {
        return;
      }

      markItemPending(menuItemId, true);
      setError(null);

      try {
        const updatedCart = await requestCart(
          `/api/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(menuItemId)}`,
          {
            method: "DELETE",
          },
        );
        setCart(updatedCart);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to remove this item.",
        );
      } finally {
        markItemPending(menuItemId, false);
      }
    },
    [markItemPending],
  );

  const clearCart = useCallback(async () => {
    const cartId = cartIdRef.current;

    if (!cartId) {
      return;
    }

    setError(null);

    try {
      const updatedCart = await requestCart(
        `/api/cart/${encodeURIComponent(cartId)}/items`,
        {
          method: "DELETE",
        },
      );
      setCart(updatedCart);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to clear cart.",
      );
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totalQuantity: cart?.totalQuantity ?? 0,
      subtotal: cart?.subtotal ?? 0,
      isHydrating,
      isOpen,
      error,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      isItemPending: (menuItemId) => pendingItemIds.has(menuItemId),
    }),
    [
      addItem,
      cart,
      clearCart,
      error,
      isHydrating,
      isOpen,
      pendingItemIds,
      removeItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
