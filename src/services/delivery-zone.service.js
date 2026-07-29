const PODGORICA_BOUNDS = {
  west: 19.15,
  south: 42.38,
  east: 19.38,
  north: 42.51,
};

function isLocationInPodgorica(latitude, longitude) {
  return (
    latitude >= PODGORICA_BOUNDS.south &&
    latitude <= PODGORICA_BOUNDS.north &&
    longitude >= PODGORICA_BOUNDS.west &&
    longitude <= PODGORICA_BOUNDS.east
  );
}

module.exports = {
  PODGORICA_BOUNDS,
  isLocationInPodgorica,
};
