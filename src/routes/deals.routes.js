const express = require("express");
const { getDeals } = require("../controllers/deals.controller");

const router = express.Router();

router.get("/", getDeals);

module.exports = router;
