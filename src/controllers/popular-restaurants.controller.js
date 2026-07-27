const prisma = require("../config/prisma");

const getPopularRestaurants = async (_request, response, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
        slug: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return response.json(restaurants);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPopularRestaurants,
};
