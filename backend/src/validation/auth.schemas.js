const { z } = require("zod");

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string().min(8).max(128);

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((phone) => phone || undefined),
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const emailOnlySchema = z.object({
  email: emailSchema,
});

module.exports = {
  emailOnlySchema,
  loginSchema,
  registerSchema,
};
