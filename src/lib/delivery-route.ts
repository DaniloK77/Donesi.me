/**
 * Geometry helpers for the courier delivery route.
 *
 * There is no routing service wired up to the demo, so the courier path is a
 * deterministic curve between the restaurant and the delivery address: a
 * Catmull-Rom spline through two seeded control points offset from the direct
 * line. The seed is the order id, so the same order always renders the same
 * route across reloads.
 *
 * All curve maths runs on a local metric plane (meters relative to the start
 * point) so offsets stay circular instead of being stretched by the longitude
 * compression at Podgorica's latitude.
 */

export type RoutePoint = {
  latitude: number;
  longitude: number;
};

export type DeliveryRoute = {
  /** Sampled polyline from the restaurant to the delivery address */
  points: RoutePoint[];
  /** Distance travelled along the route at each point, in meters */
  cumulativeMeters: number[];
  /** Total route length in meters */
  totalMeters: number;
};

export type RoutePosition = {
  point: RoutePoint;
  /** Direction of travel in degrees, clockwise from north */
  headingDegrees: number;
};

const EARTH_RADIUS_METERS = 6371000;
const METERS_PER_DEGREE_LATITUDE = 110574;
const SAMPLES_PER_SEGMENT = 24;
/** Below this distance a detour curve looks artificial, so keep a straight line. */
const MIN_CURVED_ROUTE_METERS = 120;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const metersPerDegreeLongitude = (latitude: number) =>
  111320 * Math.cos(toRadians(latitude));

export function distanceInMeters(from: RoutePoint, to: RoutePoint) {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const halfChord =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(halfChord));
}

export function bearingInDegrees(from: RoutePoint, to: RoutePoint) {
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const y = Math.sin(deltaLongitude) * Math.cos(toLatitude);
  const x =
    Math.cos(fromLatitude) * Math.sin(toLatitude) -
    Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(deltaLongitude);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

type LocalPoint = { x: number; y: number };

const toLocalPoint = (point: RoutePoint, origin: RoutePoint): LocalPoint => ({
  x: (point.longitude - origin.longitude) * metersPerDegreeLongitude(origin.latitude),
  y: (point.latitude - origin.latitude) * METERS_PER_DEGREE_LATITUDE,
});

const toRoutePoint = (point: LocalPoint, origin: RoutePoint): RoutePoint => ({
  latitude: origin.latitude + point.y / METERS_PER_DEGREE_LATITUDE,
  longitude:
    origin.longitude + point.x / metersPerDegreeLongitude(origin.latitude),
});

/** Deterministic 0..1 generator so a given order id always yields one route. */
function createSeededRandom(seed: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  let state = hash >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function catmullRom(
  previous: LocalPoint,
  start: LocalPoint,
  end: LocalPoint,
  next: LocalPoint,
  t: number,
): LocalPoint {
  const t2 = t * t;
  const t3 = t2 * t;

  const interpolate = (p0: number, p1: number, p2: number, p3: number) =>
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3);

  return {
    x: interpolate(previous.x, start.x, end.x, next.x),
    y: interpolate(previous.y, start.y, end.y, next.y),
  };
}

function buildCumulativeMeters(points: RoutePoint[]) {
  const cumulativeMeters = [0];

  for (let index = 1; index < points.length; index += 1) {
    cumulativeMeters.push(
      cumulativeMeters[index - 1] +
        distanceInMeters(points[index - 1], points[index]),
    );
  }

  return cumulativeMeters;
}

function buildStraightRoute(from: RoutePoint, to: RoutePoint): DeliveryRoute {
  const points = [from, to];
  const cumulativeMeters = buildCumulativeMeters(points);

  return {
    points,
    cumulativeMeters,
    totalMeters: cumulativeMeters[cumulativeMeters.length - 1],
  };
}

/**
 * Builds the courier path from the restaurant (A) to the delivery address (B).
 * `seed` keeps the shape stable — pass the order id.
 */
export function buildDeliveryRoute(
  from: RoutePoint,
  to: RoutePoint,
  seed: string,
): DeliveryRoute {
  const directMeters = distanceInMeters(from, to);

  if (directMeters < MIN_CURVED_ROUTE_METERS) {
    return buildStraightRoute(from, to);
  }

  const random = createSeededRandom(seed);
  const start: LocalPoint = { x: 0, y: 0 };
  const end = toLocalPoint(to, from);
  const length = Math.hypot(end.x, end.y);
  const unit = { x: end.x / length, y: end.y / length };
  const normal = { x: -unit.y, y: unit.x };
  const side = random() < 0.5 ? -1 : 1;

  // Two opposing detours read as a street network rather than a flight path.
  const firstOffset = side * (0.08 + random() * 0.09) * length;
  const secondOffset = -side * (0.05 + random() * 0.08) * length;

  const controlPoints: LocalPoint[] = [
    start,
    {
      x: unit.x * length * 0.33 + normal.x * firstOffset,
      y: unit.y * length * 0.33 + normal.y * firstOffset,
    },
    {
      x: unit.x * length * 0.68 + normal.x * secondOffset,
      y: unit.y * length * 0.68 + normal.y * secondOffset,
    },
    end,
  ];

  // Phantom endpoints keep the spline tangent to the route at A and B.
  const phantomStart: LocalPoint = {
    x: 2 * controlPoints[0].x - controlPoints[1].x,
    y: 2 * controlPoints[0].y - controlPoints[1].y,
  };
  const phantomEnd: LocalPoint = {
    x: 2 * controlPoints[3].x - controlPoints[2].x,
    y: 2 * controlPoints[3].y - controlPoints[2].y,
  };
  const spline = [phantomStart, ...controlPoints, phantomEnd];

  const points: RoutePoint[] = [from];

  for (let segment = 1; segment < spline.length - 2; segment += 1) {
    for (let step = 1; step <= SAMPLES_PER_SEGMENT; step += 1) {
      const local = catmullRom(
        spline[segment - 1],
        spline[segment],
        spline[segment + 1],
        spline[segment + 2],
        step / SAMPLES_PER_SEGMENT,
      );
      points.push(toRoutePoint(local, from));
    }
  }

  // Land exactly on the address instead of the last sampled point.
  points[points.length - 1] = to;

  const cumulativeMeters = buildCumulativeMeters(points);

  return {
    points,
    cumulativeMeters,
    totalMeters: cumulativeMeters[cumulativeMeters.length - 1],
  };
}

function findSegmentIndex(route: DeliveryRoute, meters: number) {
  const { cumulativeMeters } = route;
  let index = 1;

  while (
    index < cumulativeMeters.length - 1 &&
    cumulativeMeters[index] < meters
  ) {
    index += 1;
  }

  return index;
}

const interpolatePoints = (
  from: RoutePoint,
  to: RoutePoint,
  ratio: number,
): RoutePoint => ({
  latitude: from.latitude + (to.latitude - from.latitude) * ratio,
  longitude: from.longitude + (to.longitude - from.longitude) * ratio,
});

/** Position and heading after travelling `meters` along the route. */
export function positionAtDistance(
  route: DeliveryRoute,
  meters: number,
): RoutePosition {
  const { points, cumulativeMeters, totalMeters } = route;

  if (points.length < 2) {
    return { point: points[0], headingDegrees: 0 };
  }

  const clamped = Math.min(Math.max(meters, 0), totalMeters);
  const index = findSegmentIndex(route, clamped);
  const segmentStart = cumulativeMeters[index - 1];
  const segmentLength = cumulativeMeters[index] - segmentStart;
  const ratio = segmentLength > 0 ? (clamped - segmentStart) / segmentLength : 0;
  const from = points[index - 1];
  const to = points[index];

  return {
    point: interpolatePoints(from, to, ratio),
    headingDegrees: bearingInDegrees(from, to),
  };
}

export const toLngLat = (point: RoutePoint): [number, number] => [
  point.longitude,
  point.latitude,
];

/**
 * Coordinates for the part of the route between two distances, with exact
 * interpolated endpoints. Used to draw the travelled and remaining legs.
 */
export function sliceRouteCoordinates(
  route: DeliveryRoute,
  fromMeters: number,
  toMeters: number,
): [number, number][] {
  const { points, cumulativeMeters, totalMeters } = route;
  const start = Math.min(Math.max(fromMeters, 0), totalMeters);
  const end = Math.min(Math.max(toMeters, start), totalMeters);

  const coordinates: [number, number][] = [
    toLngLat(positionAtDistance(route, start).point),
  ];

  for (let index = 0; index < points.length; index += 1) {
    const distance = cumulativeMeters[index];
    if (distance > start && distance < end) {
      coordinates.push(toLngLat(points[index]));
    }
  }

  coordinates.push(toLngLat(positionAtDistance(route, end).point));

  return coordinates;
}
