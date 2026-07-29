const { DealCategory } = require("@prisma/client");
const prisma = require("../config/prisma");

const dealCategories = Object.values(DealCategory);

const getDeals = async (request, response, next) => {
  try {
    const { category } = request.query;

    if (
      category !== undefined &&
      (typeof category !== "string" || !dealCategories.includes(category))
    ) {
      return response.status(400).json({
        error: `Invalid category. Allowed values: ${dealCategories.join(", ")}`,
      });
    }

    const deals = await prisma.deal.findMany({
      where: category ? { category } : undefined,
      orderBy: {
        createdAt: "asc",
      },
    });

    return response.json(deals);
  } catch (error) {
    return next(error);
  }
};

const getWeeklyDeals = async (_request, response, next) => {
  try {
    const weeklyMenuItems = await prisma.menuItem.findMany({
      where: {
        weeklyDiscountPercent: {
          not: null,
        },
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        weeklyDiscountPercent: true,
        discountWeekStart: true,
        displayOrder: true,
        menuCategory: {
          select: {
            name: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                displayOrder: true,
              },
            },
          },
        },
      },
    });

    const dealsByRestaurant = new Map();

    for (const menuItem of weeklyMenuItems) {
      const { restaurant } = menuItem.menuCategory;
      const originalPrice = Number(menuItem.price);
      const discountPercent = menuItem.weeklyDiscountPercent;

      if (discountPercent === null) {
        continue;
      }

      if (!dealsByRestaurant.has(restaurant.id)) {
        dealsByRestaurant.set(restaurant.id, {
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            logoUrl: restaurant.logoUrl,
            displayOrder: restaurant.displayOrder,
          },
          items: [],
        });
      }

      dealsByRestaurant.get(restaurant.id).items.push({
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        imageUrl: menuItem.imageUrl,
        menuCategory: menuItem.menuCategory.name,
        originalPrice,
        discountedPrice: Number(
          (originalPrice * (1 - discountPercent / 100)).toFixed(2),
        ),
        weeklyDiscountPercent: discountPercent,
        discountWeekStart: menuItem.discountWeekStart,
        displayOrder: menuItem.displayOrder,
      });
    }

    const groupedDeals = Array.from(dealsByRestaurant.values())
      .sort(
        (first, second) =>
          first.restaurant.displayOrder - second.restaurant.displayOrder,
      )
      .map(({ restaurant, items }) => ({
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          logoUrl: restaurant.logoUrl,
        },
        items: items.sort(
          (first, second) =>
            second.weeklyDiscountPercent -
              first.weeklyDiscountPercent ||
            first.displayOrder - second.displayOrder,
        ),
      }));

    return response.json(groupedDeals);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDeals,
  getWeeklyDeals,
};
