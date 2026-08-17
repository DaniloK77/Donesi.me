export type CourierVehicle = "SCOOTER" | "BICYCLE" | "CAR";

export type Courier = {
  name: string;
  initials: string;
  phone: string;
  vehicle: CourierVehicle;
  rating: number;
};

const COURIERS: { name: string; phone: string; vehicle: CourierVehicle }[] = [
  { name: "Stefan Radulović", phone: "+382 67 204 118", vehicle: "SCOOTER" },
  { name: "Ivan Marković", phone: "+382 68 331 902", vehicle: "BICYCLE" },
  { name: "Miloš Vujošević", phone: "+382 69 447 210", vehicle: "CAR" },
  { name: "Jelena Popović", phone: "+382 67 512 663", vehicle: "SCOOTER" },
  { name: "Vuk Nikolić", phone: "+382 68 690 574", vehicle: "CAR" },
  { name: "Andrea Vukčević", phone: "+382 69 118 435", vehicle: "SCOOTER" },
];

const RATINGS = [4.7, 4.8, 4.9, 4.6, 5.0, 4.8];

function hashString(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function toInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function getOrderCourier(orderId: string): Courier {
  const hash = hashString(orderId);
  const courier = COURIERS[hash % COURIERS.length];

  return {
    ...courier,
    initials: toInitials(courier.name),
    rating: RATINGS[hash % RATINGS.length],
  };
}

/**
 * The courier to show for an order: the one actually assigned by the API when
 * there is one, otherwise the deterministic stand-in so the demo still has a
 * name and a number on screen.
 */
export function resolveOrderCourier(
  orderId: string,
  assigned: {
    name: string;
    phone: string;
    vehicle: CourierVehicle;
    rating: number;
  } | null,
): Courier {
  if (!assigned) {
    return getOrderCourier(orderId);
  }

  return {
    name: assigned.name,
    phone: assigned.phone,
    vehicle: assigned.vehicle,
    rating: assigned.rating,
    initials: toInitials(assigned.name),
  };
}
