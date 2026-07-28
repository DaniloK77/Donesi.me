const prisma = require("../config/prisma");

const MAX_ITEM_QUANTITY = 99;

const cartInclude = {
  items: {
    orderBy: {
      createdAt: "asc",
    },
    include: {
      menuItem: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          isAvailable: true,
          menuCategory: {
            select: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

const serializeCart = (cart) => {
  const items = cart.items.map((cartItem) => {
    const unitPrice = Number(cartItem.unitPrice);
    const lineTotal = Number((unitPrice * cartItem.quantity).toFixed(2));

    return {
      id: cartItem.id,
      menuItemId: cartItem.menuItem.id,
      name: cartItem.menuItem.name,
      imageUrl: cartItem.menuItem.imageUrl,
      isAvailable: cartItem.menuItem.isAvailable,
      quantity: cartItem.quantity,
      unitPrice,
      lineTotal,
      restaurant: cartItem.menuItem.menuCategory.restaurant,
    };
  });
  const subtotal = Number(
    items
      .reduce((total, cartItem) => total + cartItem.lineTotal, 0)
      .toFixed(2),
  );

  return {
    id: cart.id,
    items,
    totalQuantity: items.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0,
    ),
    subtotal,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const findCart = (cartId) =>
  prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: cartInclude,
  });

const sendNotFound = (response) =>
  response.status(404).json({
    code: "CART_NOT_FOUND",
    error: "Cart not found.",
  });

const getQuantity = (value) => {
  const quantity = Number(value);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_ITEM_QUANTITY
  ) {
    return null;
  }

  return quantity;
};

const createCart = async (_request, response, next) => {
  try {
    const cart = await prisma.cart.create({
      data: {},
      include: cartInclude,
    });

    return response.status(201).json(serializeCart(cart));
  } catch (error) {
    return next(error);
  }
};

const getCart = async (request, response, next) => {
  try {
    const cart = await findCart(request.params.cartId);

    if (!cart) {
      return sendNotFound(response);
    }

    return response.json(serializeCart(cart));
  } catch (error) {
    return next(error);
  }
};

const addCartItem = async (request, response, next) => {
  try {
    const quantity = getQuantity(request.body.quantity ?? 1);

    if (!quantity || typeof request.body.menuItemId !== "string") {
      return response.status(400).json({
        code: "INVALID_CART_ITEM",
        error: `menuItemId is required and quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`,
      });
    }

    const [cart, menuItem, existingCartItem] = await Promise.all([
      prisma.cart.findUnique({
        where: {
          id: request.params.cartId,
        },
        select: {
          id: true,
        },
      }),
      prisma.menuItem.findUnique({
        where: {
          id: request.body.menuItemId,
        },
        select: {
          id: true,
          price: true,
          isAvailable: true,
        },
      }),
      prisma.cartItem.findUnique({
        where: {
          cartId_menuItemId: {
            cartId: request.params.cartId,
            menuItemId: request.body.menuItemId,
          },
        },
        select: {
          quantity: true,
        },
      }),
    ]);

    if (!cart) {
      return sendNotFound(response);
    }

    if (!menuItem) {
      return response.status(404).json({
        code: "MENU_ITEM_NOT_FOUND",
        error: "Menu item not found.",
      });
    }

    if (!menuItem.isAvailable) {
      return response.status(409).json({
        code: "MENU_ITEM_UNAVAILABLE",
        error: "Menu item is currently unavailable.",
      });
    }

    if (
      existingCartItem &&
      existingCartItem.quantity + quantity > MAX_ITEM_QUANTITY
    ) {
      return response.status(400).json({
        code: "MAX_QUANTITY_EXCEEDED",
        error: `A cart item cannot exceed ${MAX_ITEM_QUANTITY}.`,
      });
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId: menuItem.id,
        },
      },
      create: {
        cartId: cart.id,
        menuItemId: menuItem.id,
        quantity,
        unitPrice: menuItem.price,
      },
      update: {
        quantity: {
          increment: quantity,
        },
        unitPrice: menuItem.price,
      },
    });

    const updatedCart = await findCart(cart.id);

    return response.status(201).json(serializeCart(updatedCart));
  } catch (error) {
    return next(error);
  }
};

const updateCartItem = async (request, response, next) => {
  try {
    const quantity = getQuantity(request.body.quantity);

    if (!quantity) {
      return response.status(400).json({
        code: "INVALID_QUANTITY",
        error: `Quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`,
      });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        id: request.params.cartId,
      },
      select: {
        id: true,
      },
    });

    if (!cart) {
      return sendNotFound(response);
    }

    const updatedItems = await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        menuItemId: request.params.menuItemId,
      },
      data: {
        quantity,
      },
    });

    if (updatedItems.count === 0) {
      return response.status(404).json({
        code: "CART_ITEM_NOT_FOUND",
        error: "Cart item not found.",
      });
    }

    const updatedCart = await findCart(cart.id);

    return response.json(serializeCart(updatedCart));
  } catch (error) {
    return next(error);
  }
};

const removeCartItem = async (request, response, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        id: request.params.cartId,
      },
      select: {
        id: true,
      },
    });

    if (!cart) {
      return sendNotFound(response);
    }

    const deletedItems = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        menuItemId: request.params.menuItemId,
      },
    });

    if (deletedItems.count === 0) {
      return response.status(404).json({
        code: "CART_ITEM_NOT_FOUND",
        error: "Cart item not found.",
      });
    }

    const updatedCart = await findCart(cart.id);

    return response.json(serializeCart(updatedCart));
  } catch (error) {
    return next(error);
  }
};

const clearCart = async (request, response, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        id: request.params.cartId,
      },
      select: {
        id: true,
      },
    });

    if (!cart) {
      return sendNotFound(response);
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const updatedCart = await findCart(cart.id);

    return response.json(serializeCart(updatedCart));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addCartItem,
  clearCart,
  createCart,
  getCart,
  removeCartItem,
  updateCartItem,
};
