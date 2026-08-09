const argon2 = require("argon2");
const prisma = require("../config/prisma");
const {
  clearSessionCookie,
  publicUserSelect,
} = require("../services/auth.service");
const {
  changePasswordSchema,
  updateProfileSchema,
} = require("../validation/users.schemas");

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const updateProfile = async (request, response, next) => {
  const result = updateProfileSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const data = {};

    if (result.data.name !== undefined) {
      data.name = result.data.name;
    }

    if (result.data.phone !== undefined) {
      data.phone = result.data.phone;
    }

    const user = await prisma.user.update({
      where: { id: request.user.id },
      data,
      select: publicUserSelect,
    });

    return response.json({ user });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (request, response, next) => {
  const result = changePasswordSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const userWithPassword = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, passwordHash: true },
    });

    const isCurrentPasswordValid = await argon2.verify(
      userWithPassword.passwordHash,
      result.data.currentPassword,
    );

    if (!isCurrentPasswordValid) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        error: "The current password is incorrect.",
      });
    }

    const passwordHash = await argon2.hash(result.data.newPassword, {
      type: argon2.argon2id,
    });

    await prisma.user.update({
      where: { id: userWithPassword.id },
      data: { passwordHash },
    });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const deleteAccount = async (request, response, next) => {
  try {
    await prisma.user.delete({
      where: { id: request.user.id },
    });

    clearSessionCookie(response);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  changePassword,
  deleteAccount,
  updateProfile,
};
