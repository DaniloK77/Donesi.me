const {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  deleteSessionByToken,
  findSessionByToken,
  isSessionExpired,
} = require("../services/auth.service");

const sendUnauthorized = (response) =>
  response.status(401).json({
    code: "AUTH_REQUIRED",
    error: "Authentication is required.",
  });

const requireAuth = async (request, response, next) => {
  try {
    const token = request.cookies?.[SESSION_COOKIE_NAME];
    const session = await findSessionByToken(token);

    if (!session) {
      clearSessionCookie(response);
      return sendUnauthorized(response);
    }

    if (isSessionExpired(session)) {
      await deleteSessionByToken(token);
      clearSessionCookie(response);
      return sendUnauthorized(response);
    }

    request.user = session.user;
    request.authSession = session;
    request.authToken = token;

    return next();
  } catch (error) {
    return next(error);
  }
};

const requireRole = (...allowedRoles) => [
  requireAuth,
  (request, response, next) => {
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        code: "FORBIDDEN",
        error: "You do not have permission to access this resource.",
      });
    }

    return next();
  },
];

module.exports = {
  requireAuth,
  requireRole,
};
