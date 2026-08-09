const prisma = require("../config/prisma");
const { stripDiacritics } = require("../utils/text");

const normalizeStreetSearch = (value) =>
  stripDiacritics(value.normalize("NFC").toLocaleLowerCase("sr-Latn-ME"));

const getStreets = async (request, response, next) => {
  try {
    const query =
      typeof request.query.query === "string"
        ? request.query.query.trim()
        : "";

    const streets = await prisma.podgoricaStreet.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!query) {
      return response.json(streets);
    }

    const normalizedQuery = normalizeStreetSearch(query);
    const matchingStreets = streets.filter((street) =>
      normalizeStreetSearch(street.name).includes(normalizedQuery),
    );

    return response.json(matchingStreets);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStreets,
};
