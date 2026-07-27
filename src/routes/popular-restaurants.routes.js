const express = require("express");
const {
  getPopularRestaurants,
} = require("../controllers/popular-restaurants.controller");

const router = express.Router();

router.get("/", getPopularRestaurants);

module.exports = router;
