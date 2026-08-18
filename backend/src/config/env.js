const dotenv = require("dotenv");

dotenv.config({ quiet: true });

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  // Public origin of this API, used to build URLs for uploaded files.
  // Falls back to the request host when unset.
  publicApiUrl: process.env.PUBLIC_API_URL || "",
  isProduction: process.env.NODE_ENV === "production",
  sessionDurationDays: Number(process.env.SESSION_DURATION_DAYS || 7),
  sessionRefreshThresholdHours: Number(
    process.env.SESSION_REFRESH_THRESHOLD_HOURS || 24,
  ),
};
