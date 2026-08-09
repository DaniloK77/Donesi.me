const { rateLimit } = require("express-rate-limit");

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_request, response) =>
    response.status(429).json({
      code: "AUTH_RATE_LIMITED",
      error: "Too many authentication attempts. Please try again later.",
    }),
});

module.exports = authRateLimit;
