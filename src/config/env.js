const dotenv = require("dotenv");

dotenv.config({ quiet: true });

module.exports = {
  port: process.env.PORT || 3000,
};
