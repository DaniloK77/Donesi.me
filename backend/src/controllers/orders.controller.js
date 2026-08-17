const prisma = require("../config/prisma");
const { createOrderSchema } = require("../validation/orders.schemas");
const {
  loadPickupRestaurants,
  orderInclude,
  serializeOrder,
  serializeOrders,
} = require("../services/orders.serializer");
const {
  getCancellationState,
} = require("../services/order-cancellation.service");

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const createOrder = async (request, response, next) => {
  const result = createOrderSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  const { cartId, deliveryType, addressId } = result.data;

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                isAvailable: true,
                menuCategory: {
                  select: {
                    restaurant: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return response.status(400).json({
        code: "EMPTY_CART",
        error: "The cart is empty.",
      });
    }

    const unavailableItem = cart.items.find(
      (item) => !item.menuItem.isAvailable,
    );

    if (unavailableItem) {
      return response.status(409).json({
        code: "MENU_ITEM_UNAVAILABLE",
        error: `${unavailableItem.menuItem.name} is currently unavailable.`,
      });
    }

    let address = null;

    if (deliveryType === "DELIVERY") {
      address = addressId
        ? await prisma.address.findUnique({ where: { id: addressId } })
        : await prisma.address.findFirst({
            where: { userId: request.user.id },
            orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          });

      if (!address || address.userId !== request.user.id) {
        return response.status(400).json({
          code: "ADDRESS_REQUIRED",
          error: "A delivery address is required.",
        });
      }
    }

    const subtotal = cart.items.reduce(
      (total, item) => total + Number(item.unitPrice) * item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: request.user.id,
          deliveryType,
          addressLabel: address?.label ?? null,
          addressStreet: address?.street ?? null,
          addressCity: address?.city ?? null,
          addressLatitude: address?.latitude ?? null,
          addressLongitude: address?.longitude ?? null,
          subtotal: Number(subtotal.toFixed(2)),
          items: {
            create: cart.items.map((item) => ({
              menuItemId: item.menuItem.id,
              name: item.menuItem.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              customization: item.customization ?? undefined,
              restaurantId: item.menuItem.menuCategory.restaurant.id,
              restaurantName: item.menuItem.menuCategory.restaurant.name,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    const restaurantsById = await loadPickupRestaurants([order]);

    return response.status(201).json(serializeOrder(order, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

const listOrders = async (request, response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: request.user.id },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });

    return response.json(await serializeOrders(orders));
  } catch (error) {
    return next(error);
  }
};

const getOrder = async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: request.params.id },
      include: orderInclude,
    });

    if (!order || order.userId !== request.user.id) {
      return response.status(404).json({
        code: "ORDER_NOT_FOUND",
        error: "Order not found.",
      });
    }

    const restaurantsById = await loadPickupRestaurants([order]);

    return response.json(serializeOrder(order, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

/**
 * Customer-initiated cancellation. The window and the eligible statuses are
 * decided by order-cancellation.service, the same source the serialized order
 * advertises to the client — the client's button is a hint, this is the rule.
 */
const cancelOrder = async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: request.params.id },
      include: orderInclude,
    });

    if (!order || order.userId !== request.user.id) {
      return response.status(404).json({
        code: "ORDER_NOT_FOUND",
        error: "Order not found.",
      });
    }

    const cancellation = getCancellationState(order);

    if (!cancellation.canCancel) {
      const errors = {
        ALREADY_CANCELLED: "This order has already been cancelled.",
        TOO_FAR_ALONG:
          "This order is already on its way and can no longer be cancelled.",
        WINDOW_EXPIRED: `Orders can only be cancelled within ${cancellation.windowMinutes} minutes of being placed.`,
      };

      return response.status(409).json({
        code: `CANCELLATION_${cancellation.reason}`,
        error: errors[cancellation.reason] ?? "This order cannot be cancelled.",
        cancellation,
      });
    }

    const cancelled = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelledBy: "CUSTOMER",
        cancellationReason: request.body?.reason?.trim?.() || null,
      },
      include: orderInclude,
    });

    const restaurantsById = await loadPickupRestaurants([cancelled]);

    return response.json(serializeOrder(cancelled, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  cancelOrder,
  createOrder,
  getOrder,
  listOrders,
};
