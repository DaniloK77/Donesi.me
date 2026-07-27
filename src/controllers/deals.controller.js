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

module.exports = {
  getDeals,
};
