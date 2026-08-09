const express = require("express");
const {
  getDeals,
  getWeeklyDeals,
} = require("../controllers/deals.controller");

const router = express.Router();

router.get("/weekly", getWeeklyDeals);
router.get("/", getDeals);

module.exports = router;
