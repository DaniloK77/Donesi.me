const prisma = require("../config/prisma");

const getPopularRestaurants = async (_request, response, next) => {
  try {
    const restaurants = await prisma.popularRestaurant.findMany({
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
