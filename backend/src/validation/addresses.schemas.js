const { z } = require("zod");

const createAddressSchema = z.object({
  label: z.string().trim().min(1).max(60),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100).optional().default("Podgorica"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isDefault: z.boolean().optional().default(false),
});

const updateAddressSchema = z
  .object({
    label: z.string().trim().min(1).max(60).optional(),
    street: z.string().trim().min(1).max(200).optional(),
    city: z.string().trim().min(1).max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isDefault: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided." },
  );

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
