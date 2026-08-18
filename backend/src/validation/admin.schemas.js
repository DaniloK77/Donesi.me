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

const updateCourierSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(3).max(40).optional(),
    vehicle: z.enum(["SCOOTER", "BICYCLE", "CAR"]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update.",
  });

const menuCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
});

const createMenuItemSchema = z.object({
  menuCategoryId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullish(),
  price: z.coerce.number().positive().max(100000),
  imageUrl: z.string().trim().max(500).nullish(),
  isAvailable: z.boolean().optional(),
});

const updateMenuItemSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(500).nullish(),
    price: z.coerce.number().positive().max(100000).optional(),
    imageUrl: z.string().trim().max(500).nullish(),
    isAvailable: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update.",
  });

module.exports = {
  assignCourierSchema,
  createMenuItemSchema,
  menuCategorySchema,
  updateCourierSchema,
  updateMenuItemSchema,
  listOrdersQuerySchema,
  orderStatuses,
  updateOrderStatusSchema,
};
