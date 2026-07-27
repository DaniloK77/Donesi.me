const express = require("express");
const {
  getRestaurantBySlug,
  getRestaurants,
} = require("../controllers/restaurants.controller");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:slug", getRestaurantBySlug);

module.exports = router;
