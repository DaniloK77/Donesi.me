const prisma = require("../config/prisma");

const categoryOrder = [
  "burgers-fast-food",
  "salads",
  "pasta-casuals",
  "pizza",
  "breakfast",
  "soups",
];

const getCategories = async (_request, response, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          in: categoryOrder,
        },
      },
    });

    const categoriesBySlug = new Map(
      categories.map((category) => [category.slug, category]),
    );
    const orderedCategories = categoryOrder
      .map((slug) => categoriesBySlug.get(slug))
      .filter(Boolean);

    return response.json(orderedCategories);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCategories,
};
