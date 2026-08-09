const { z } = require("zod");

const createOrderSchema = z.object({
  cartId: z.string().trim().min(1),
  deliveryType: z.enum(["DELIVERY", "PICKUP"]).optional().default("DELIVERY"),
  addressId: z.string().trim().min(1).optional(),
});

module.exports = {
  createOrderSchema,
};
