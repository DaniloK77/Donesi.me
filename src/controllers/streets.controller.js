const prisma = require("../config/prisma");

const getStreets = async (request, response, next) => {
  try {
    const query =
      typeof request.query.query === "string"
        ? request.query.query.trim()
        : "";

    const streets = await prisma.podgoricaStreet.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        name: "asc",
      },
    });

    return response.json(streets);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStreets,
};
