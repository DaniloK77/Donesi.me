const prisma = require("../config/prisma");
const {
  createAddressSchema,
  updateAddressSchema,
} = require("../validation/addresses.schemas");

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const sendNotFound = (response) =>
  response.status(404).json({
    code: "ADDRESS_NOT_FOUND",
    error: "Address not found.",
  });

const listAddresses = async (request, response, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: request.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    return response.json(addresses);
  } catch (error) {
    return next(error);
  }
};

const createAddress = async (request, response, next) => {
  const result = createAddressSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const address = await prisma.$transaction(async (tx) => {
      if (result.data.isDefault) {
        await tx.address.updateMany({
          where: { userId: request.user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          ...result.data,
          userId: request.user.id,
        },
      });
    });

    return response.status(201).json(address);
  } catch (error) {
    return next(error);
  }
};

const updateAddress = async (request, response, next) => {
  const result = updateAddressSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const existingAddress = await prisma.address.findUnique({
      where: { id: request.params.id },
      select: { id: true, userId: true },
    });

    if (!existingAddress || existingAddress.userId !== request.user.id) {
      return sendNotFound(response);
    }

    const address = await prisma.$transaction(async (tx) => {
      if (result.data.isDefault) {
        await tx.address.updateMany({
          where: {
            userId: request.user.id,
            isDefault: true,
            id: { not: existingAddress.id },
          },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: existingAddress.id },
        data: result.data,
      });
    });

    return response.json(address);
  } catch (error) {
    return next(error);
  }
};

const deleteAddress = async (request, response, next) => {
  try {
    const existingAddress = await prisma.address.findUnique({
      where: { id: request.params.id },
      select: { id: true, userId: true },
    });

    if (!existingAddress || existingAddress.userId !== request.user.id) {
      return sendNotFound(response);
    }

    await prisma.address.delete({ where: { id: existingAddress.id } });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
};
