const prisma = require("../config/prisma");

const restaurantListSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  coverImageUrl: true,
  category: true,
  rating: true,
  address: true,
  city: true,
  deliveryTimeMin: true,
  displayOrder: true,
};

const getRestaurants = async (_request, response, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: restaurantListSelect,
      orderBy: {
        displayOrder: "asc",
      },
    });

    return response.json(restaurants);
  } catch (error) {
    return next(error);
  }
};

const getRestaurantBySlug = async (request, response, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: request.params.slug,
      },
      include: {
        menuCategories: {
          orderBy: {
            displayOrder: "asc",
          },
          include: {
            items: {
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return response.status(404).json({
        error: "Restaurant not found.",
      });
    }

    return response.json({
      ...restaurant,
      menuCategories: restaurant.menuCategories.map((category) => ({
        ...category,
        items: category.items.map((menuItem) => ({
          ...menuItem,
          price: Number(menuItem.price),
        })),
      })),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRestaurantBySlug,
  getRestaurants,
};
