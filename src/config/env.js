const dotenv = require("dotenv");

dotenv.config({ quiet: true });

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
