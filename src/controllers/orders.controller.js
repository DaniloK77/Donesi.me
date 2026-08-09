const prisma = require("../config/prisma");
const { createOrderSchema } = require("../validation/orders.schemas");

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const orderItemInclude = {
  items: {
    orderBy: { createdAt: "asc" },
  },
};

const serializeOrder = (order) => ({
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
  subtotal: Number(order.subtotal),
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
        include: orderItemInclude,
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return response.status(201).json(serializeOrder(order));
  } catch (error) {
    return next(error);
  }
};

const listOrders = async (request, response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: request.user.id },
      include: orderItemInclude,
      orderBy: { createdAt: "desc" },
    });

    return response.json(orders.map(serializeOrder));
  } catch (error) {
    return next(error);
  }
};

const getOrder = async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: request.params.id },
      include: orderItemInclude,
    });

    if (!order || order.userId !== request.user.id) {
      return response.status(404).json({
        code: "ORDER_NOT_FOUND",
        error: "Order not found.",
      });
    }

    return response.json(serializeOrder(order));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrder,
  listOrders,
};
