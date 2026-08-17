const prisma = require("../config/prisma");
const { getCancellationState } = require("./order-cancellation.service");

/**
 * Shared shape of an order as returned by the API. Used by both the customer
 * facing orders controller and the admin controller so the two never drift.
 */

const orderInclude = {
  items: {
    orderBy: { createdAt: "asc" },
  },
  courier: true,
};

/** Adds the customer to the include — admin views list orders across users. */
const adminOrderInclude = {
  ...orderInclude,
  user: {
    select: { id: true, name: true, email: true, phone: true, role: true },
  },
};

const pickupRestaurantSelect = {
  id: true,
  name: true,
  slug: true,
  address: true,
  city: true,
  latitude: true,
  longitude: true,
};

/**
 * Loads the restaurants an order is picked up from, keyed by id. The delivery
 * tracking map needs the restaurant coordinates as the courier's starting
 * point, and order items only carry the restaurant id and name.
 */
const loadPickupRestaurants = async (orders) => {
  const restaurantIds = [
    ...new Set(
      orders.flatMap((order) => order.items.map((item) => item.restaurantId)),
    ),
  ];

  if (restaurantIds.length === 0) {
    return new Map();
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { id: { in: restaurantIds } },
    select: pickupRestaurantSelect,
  });

  return new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]));
};

/**
 * An order is placed with a single restaurant, so the first item determines the
 * pickup point. Returns null when the restaurant has since been removed.
 */
const resolvePickupRestaurant = (order, restaurantsById) => {
  const restaurantId = order.items[0]?.restaurantId;

  return restaurantId ? (restaurantsById.get(restaurantId) ?? null) : null;
};

const serializeCourier = (courier) =>
  courier
    ? {
        id: courier.id,
        name: courier.name,
        phone: courier.phone,
        vehicle: courier.vehicle,
        rating: courier.rating,
        isActive: courier.isActive,
      }
    : null;

const serializeOrder = (order, restaurantsById = new Map()) => ({
  id: order.id,
  status: order.status,
  deliveryType: order.deliveryType,
  address:
    order.deliveryType === "DELIVERY"
      ? {
          label: order.addressLabel,
          street: order.addressStreet,
          city: order.addressCity,
          latitude: order.addressLatitude,
          longitude: order.addressLongitude,
        }
      : null,
  restaurant: resolvePickupRestaurant(order, restaurantsById),
  courier: serializeCourier(order.courier),
  // Only present when the caller included the user relation (admin views).
  ...(order.user
    ? {
        customer: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
        },
      }
    : {}),
  subtotal: Number(order.subtotal),
  paymentMethod: order.paymentMethod,
  confirmedAt: order.confirmedAt,
  /**
   * The delivery promise made when the order was accepted. `at` is absolute so
   * the client can count down without guessing when the clock started.
   */
  estimate: order.estimatedDeliveryAt
    ? {
        minutes: order.estimatedDeliveryMinutes,
        at: order.estimatedDeliveryAt,
      }
    : null,
  cancellation: {
    ...getCancellationState(order),
    cancelledAt: order.cancelledAt,
    cancelledBy: order.cancelledBy,
    reasonText: order.cancellationReason,
  },
  items: order.items.map((item) => ({
    id: item.id,
    menuItemId: item.menuItemId,
    name: item.name,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    lineTotal: Number((Number(item.unitPrice) * item.quantity).toFixed(2)),
    customization: item.customization ?? null,
    restaurantId: item.restaurantId,
    restaurantName: item.restaurantName,
  })),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

/** Loads the pickup restaurants for a batch and serializes it in one go. */
const serializeOrders = async (orders) => {
  const restaurantsById = await loadPickupRestaurants(orders);

  return orders.map((order) => serializeOrder(order, restaurantsById));
};

module.exports = {
  adminOrderInclude,
  loadPickupRestaurants,
  orderInclude,
  serializeCourier,
  serializeOrder,
  serializeOrders,
};
