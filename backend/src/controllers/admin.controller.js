const prisma = require("../config/prisma");
const {
  adminOrderInclude,
  loadPickupRestaurants,
  serializeCourier,
  serializeOrder,
  serializeOrders,
} = require("../services/orders.serializer");
const {
  assignCourierSchema,
  listOrdersQuerySchema,
  updateOrderStatusSchema,
} = require("../validation/admin.schemas");

/**
 * Admin control panel API. Every route here is mounted behind
 * requireRole("ADMIN") — see routes/admin.routes.js.
 */

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const sendOrderNotFound = (response) =>
  response.status(404).json({
    code: "ORDER_NOT_FOUND",
    error: "Order not found.",
  });

/** Counts for the dashboard header. */
const getOverview = async (_request, response, next) => {
  try {
    const [ordersByStatus, restaurantCount, userCount, courierCount] =
      await Promise.all([
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.restaurant.count(),
        prisma.user.count(),
        prisma.courier.count(),
      ]);

    const statusCounts = Object.fromEntries(
      ordersByStatus.map((group) => [group.status, group._count._all]),
    );

    return response.json({
      orders: {
        total: ordersByStatus.reduce((sum, group) => sum + group._count._all, 0),
        byStatus: statusCounts,
      },
      restaurants: restaurantCount,
      users: userCount,
      couriers: courierCount,
    });
  } catch (error) {
    return next(error);
  }
};

/** All orders from all restaurants, newest first. */
const listOrders = async (request, response, next) => {
  const result = listOrdersQuerySchema.safeParse(request.query);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  const { status, restaurantId } = result.data;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(restaurantId ? { items: { some: { restaurantId } } } : {}),
      },
      include: adminOrderInclude,
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
      include: adminOrderInclude,
    });

    if (!order) {
      return sendOrderNotFound(response);
    }

    const restaurantsById = await loadPickupRestaurants([order]);

    return response.json(serializeOrder(order, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

/**
 * Manual status override so the whole flow can be exercised without waiting on
 * a real restaurant or courier.
 */
const updateOrderStatus = async (request, response, next) => {
  const result = updateOrderStatusSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const existing = await prisma.order.findUnique({
      where: { id: request.params.id },
      select: { id: true, courierId: true },
    });

    if (!existing) {
      return sendOrderNotFound(response);
    }

    const { status } = result.data;

    // Going out for delivery without a courier would leave the tracking map
    // without anyone to follow, so pick a free courier automatically.
    let courierId = existing.courierId;

    if (status === "OUT_FOR_DELIVERY" && !courierId) {
      const busyCourierIds = (
        await prisma.order.findMany({
          where: { status: "OUT_FOR_DELIVERY", courierId: { not: null } },
          select: { courierId: true },
        })
      ).map((order) => order.courierId);

      const availableCourier =
        (await prisma.courier.findFirst({
          where: { isActive: true, id: { notIn: busyCourierIds } },
          orderBy: { createdAt: "asc" },
        })) ??
        (await prisma.courier.findFirst({
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        }));

      courierId = availableCourier?.id ?? null;
    }

    const order = await prisma.order.update({
      where: { id: request.params.id },
      data: { status, courierId },
      include: adminOrderInclude,
    });

    const restaurantsById = await loadPickupRestaurants([order]);

    return response.json(serializeOrder(order, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

const assignCourier = async (request, response, next) => {
  const result = assignCourierSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  const { courierId } = result.data;

  try {
    const [order, courier] = await Promise.all([
      prisma.order.findUnique({
        where: { id: request.params.id },
        select: { id: true },
      }),
      courierId
        ? prisma.courier.findUnique({ where: { id: courierId } })
        : Promise.resolve(null),
    ]);

    if (!order) {
      return sendOrderNotFound(response);
    }

    if (courierId && !courier) {
      return response.status(404).json({
        code: "COURIER_NOT_FOUND",
        error: "Courier not found.",
      });
    }

    const updated = await prisma.order.update({
      where: { id: request.params.id },
      data: { courierId },
      include: adminOrderInclude,
    });

    const restaurantsById = await loadPickupRestaurants([updated]);

    return response.json(serializeOrder(updated, restaurantsById));
  } catch (error) {
    return next(error);
  }
};

/** Removes a test order along with its items (cascade). */
const deleteOrder = async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: request.params.id },
      select: { id: true },
    });

    if (!order) {
      return sendOrderNotFound(response);
    }

    await prisma.order.delete({ where: { id: request.params.id } });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/** Every restaurant with its full menu, for review from the panel. */
const listRestaurants = async (_request, response, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        menuCategories: {
          orderBy: { displayOrder: "asc" },
          include: { items: { orderBy: { displayOrder: "asc" } } },
        },
      },
    });

    return response.json(
      restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        category: restaurant.category,
        rating: restaurant.rating,
        address: restaurant.address,
        city: restaurant.city,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        deliveryTimeMin: restaurant.deliveryTimeMin,
        logoUrl: restaurant.logoUrl,
        menuItemCount: restaurant.menuCategories.reduce(
          (sum, category) => sum + category.items.length,
          0,
        ),
        menuCategories: restaurant.menuCategories.map((category) => ({
          id: category.id,
          name: category.name,
          items: category.items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
          })),
        })),
      })),
    );
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (_request, response, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });

    return response.json(
      users.map(({ _count, ...user }) => ({
        ...user,
        orderCount: _count.orders,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

const listCouriers = async (_request, response, next) => {
  try {
    const couriers = await prisma.courier.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { orders: { where: { status: "OUT_FOR_DELIVERY" } } },
        },
      },
    });

    return response.json(
      couriers.map((courier) => ({
        ...serializeCourier(courier),
        activeDeliveries: courier._count.orders,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  assignCourier,
  deleteOrder,
  getOrder,
  getOverview,
  listCouriers,
  listOrders,
  listRestaurants,
  listUsers,
  updateOrderStatus,
};
