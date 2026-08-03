const { z } = require("zod");

const phoneUpdateSchema = z
  .union([z.string().trim().min(6).max(30), z.literal(""), z.null()])
  .optional()
  .transform((phone) => {
    if (phone === undefined) {
      return undefined;
    }

    return phone ? phone : null;
  });

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: phoneUpdateSchema,
  })
  .refine(
    (data) => data.name !== undefined || data.phone !== undefined,
    { message: "At least one field must be provided." },
  );

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128),
});

module.exports = {
  changePasswordSchema,
  updateProfileSchema,
};
