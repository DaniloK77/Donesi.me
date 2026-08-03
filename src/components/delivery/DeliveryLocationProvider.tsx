"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const STORAGE_KEY = "donesi-delivery-location";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export type DeliveryLocation = {
  addressId: string | null;
  street: string;
  city: string;
  latitude: number;
  longitude: number;
};

type SetLocationInput = {
  street: string;
  city: string;
  latitude: number;
  longitude: number;
};

type AddressRecord = {
  id: string;
  label: string;
  street: string;
  city: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};

async function requestAddresses<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Address request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function readStoredLocation(): DeliveryLocation | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DeliveryLocation>;

    if (
      typeof parsed.street === "string" &&
      typeof parsed.city === "string" &&
      typeof parsed.latitude === "number" &&
      typeof parsed.longitude === "number"
    ) {
      return {
        addressId: null,
        street: parsed.street,
        city: parsed.city,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      };
    }

    return null;
  } catch {
    return null;
  }
}

function writeStoredLocation(location: DeliveryLocation | null) {
  if (!location) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
}

function toLocation(address: AddressRecord): DeliveryLocation {
  return {
    addressId: address.id,
    street: address.street,
    city: address.city,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

type DeliveryLocationContextValue = {
  location: DeliveryLocation | null;
  isHydrating: boolean;
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  setLocation: (input: SetLocationInput) => Promise<void>;
};

const DeliveryLocationContext =
  createContext<DeliveryLocationContextValue | null>(null);

export function DeliveryLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const [location, setLocationState] = useState<DeliveryLocation | null>(
    null,
  );
  const [isHydrating, setIsHydrating] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    let isCancelled = false;

    const hydrate = async () => {
      if (status === "authenticated") {
        try {
          const addresses = await requestAddresses<AddressRecord[]>(
            "/api/addresses",
          );
          const defaultAddress =
            addresses.find((address) => address.isDefault) ??
            addresses[0] ??
            null;

          if (defaultAddress) {
            if (!isCancelled) {
              setLocationState(toLocation(defaultAddress));
            }
            return;
          }

          const stored = readStoredLocation();

          if (stored) {
            const created = await requestAddresses<AddressRecord>(
              "/api/addresses",
              {
                method: "POST",
                body: JSON.stringify({
                  label: "Dostava",
                  street: stored.street,
                  city: stored.city,
                  latitude: stored.latitude,
                  longitude: stored.longitude,
                  isDefault: true,
                }),
              },
            );

            writeStoredLocation(null);

            if (!isCancelled) {
              setLocationState(toLocation(created));
            }
          }
        } catch {
          if (!isCancelled) {
            setLocationState(readStoredLocation());
          }
        }
      } else if (!isCancelled) {
        setLocationState(readStoredLocation());
      }

      if (!isCancelled) {
        setIsHydrating(false);
      }
    };

    void hydrate();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  const setLocation = useCallback(
    async (input: SetLocationInput) => {
      if (status === "authenticated") {
        try {
          const record = location?.addressId
            ? await requestAddresses<AddressRecord>(
                `/api/addresses/${location.addressId}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({ ...input, isDefault: true }),
                },
              )
            : await requestAddresses<AddressRecord>("/api/addresses", {
                method: "POST",
                body: JSON.stringify({
                  label: "Dostava",
                  ...input,
                  isDefault: true,
                }),
              });

          setLocationState(toLocation(record));
          return;
        } catch {
          // Fall back to local persistence if the backend call fails.
        }
      }

      const nextLocation: DeliveryLocation = { addressId: null, ...input };
      writeStoredLocation(nextLocation);
      setLocationState(nextLocation);
    },
    [location, status],
  );

  const value = useMemo<DeliveryLocationContextValue>(
    () => ({
      location,
      isHydrating,
      isPopupOpen,
      openPopup: () => setIsPopupOpen(true),
      closePopup: () => setIsPopupOpen(false),
      setLocation,
    }),
    [isHydrating, isPopupOpen, location, setLocation],
  );

  return (
    <DeliveryLocationContext.Provider value={value}>
      {children}
    </DeliveryLocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  const context = useContext(DeliveryLocationContext);

  if (!context) {
    throw new Error(
      "useDeliveryLocation must be used within DeliveryLocationProvider.",
    );
  }

  return context;
}
