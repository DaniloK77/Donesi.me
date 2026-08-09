const crypto = require("crypto");
const prisma = require("../config/prisma");
const {
  isProduction,
  sessionDurationDays,
  sessionRefreshThresholdHours,
} = require("../config/env");

const SESSION_COOKIE_NAME = "donesi_session";
const SESSION_DURATION_MS = sessionDurationDays * 24 * 60 * 60 * 1000;
const SESSION_REFRESH_THRESHOLD_MS =
  sessionRefreshThresholdHours * 60 * 60 * 1000;

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
};

const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

const createSessionToken = () => crypto.randomBytes(32).toString("hex");
const hashSessionToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const getSessionExpiry = () => new Date(Date.now() + SESSION_DURATION_MS);

const setSessionCookie = (response, token, expiresAt) => {
  response.cookie(SESSION_COOKIE_NAME, token, {
    ...sessionCookieOptions,
    expires: expiresAt,
  });
};

const clearSessionCookie = (response) => {
  response.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions);
};

const createUserSession = async ({ userId, userAgent, ipAddress }) => {
  const token = createSessionToken();
  const expiresAt = getSessionExpiry();
  const session = await prisma.userSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  return { session, token };
};

const findSessionByToken = async (token) => {
  if (!token) {
    return null;
  }

  return prisma.userSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });
};

const deleteSessionByToken = (token) => {
  if (!token) {
    return Promise.resolve();
  }

  return prisma.userSession.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
};

const rotateSession = async (sessionId) => {
  const token = createSessionToken();
  const expiresAt = getSessionExpiry();
  const session = await prisma.userSession.update({
    where: { id: sessionId },
    data: {
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return { session, token };
};

const isSessionExpired = (session) => session.expiresAt <= new Date();
const shouldRefreshSession = (session) =>
  session.expiresAt.getTime() - Date.now() <=
  SESSION_REFRESH_THRESHOLD_MS;

module.exports = {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  createUserSession,
  deleteSessionByToken,
  findSessionByToken,
  hashSessionToken,
  isSessionExpired,
  publicUserSelect,
  rotateSession,
  setSessionCookie,
  shouldRefreshSession,
};
