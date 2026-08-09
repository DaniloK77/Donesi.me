const prisma = require("../config/prisma");
const {
  buildMenuItemCustomization,
} = require("../services/menu-customization.service");

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
  latitude: true,
  longitude: true,
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
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

    const menuCategories = restaurant.menuCategories.map((category) => ({
      ...category,
      items: category.items.map((menuItem) => ({
        ...menuItem,
        price: Number(menuItem.price),
        customization: buildMenuItemCustomization(
          restaurant,
          category,
          menuItem,
        ),
      })),
    }));
    const featuredItems = menuCategories.flatMap((category) =>
      category.items.filter(
        (menuItem) => menuItem.isFeatured && menuItem.isAvailable,
      ),
    );

    return response.json({
      ...restaurant,
      featuredItems,
      menuCategories,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRestaurantBySlug,
  getRestaurants,
};
