const { z } = require("zod");

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
  // Only recorded when the new status is CANCELLED.
  cancellationReason: z.string().trim().min(1).max(300).optional(),
});

const assignCourierSchema = z.object({
  // null clears the assignment
  courierId: z.string().trim().min(1).nullable(),
});

const listOrdersQuerySchema = z.object({
  status: z.enum(orderStatuses).optional(),
  restaurantId: z.string().trim().min(1).optional(),
});

module.exports = {
  assignCourierSchema,
  listOrdersQuerySchema,
  orderStatuses,
  updateOrderStatusSchema,
};
