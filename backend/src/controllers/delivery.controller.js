const {
  PODGORICA_BOUNDS,
  isLocationInPodgorica,
} = require("../services/delivery-zone.service");

const checkDeliveryLocation = (request, response) => {
  const { address, city, latitude, longitude } = request.body;
  const normalizedAddress =
    typeof address === "string" ? address.trim() : "";
  const normalizedCity = typeof city === "string" ? city.trim() : "";
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!normalizedAddress) {
    return response.status(400).json({
      error: "Address is required.",
    });
  }

  if (normalizedCity.toLocaleLowerCase() !== "podgorica") {
    return response.status(400).json({
      error: "Delivery is currently available only in Podgorica.",
    });
  }

  if (
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude)
  ) {
    return response.status(400).json({
      error: "Valid latitude and longitude are required.",
    });
  }

  const isWithinPodgorica = isLocationInPodgorica(
    parsedLatitude,
    parsedLongitude,
  );

  return response.json({
    isWithinPodgorica,
    location: {
      address: normalizedAddress,
      city: "Podgorica",
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    },
    bounds: PODGORICA_BOUNDS,
  });
};

module.exports = {
  checkDeliveryLocation,
};
