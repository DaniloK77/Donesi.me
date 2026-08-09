const express = require("express");
const {
  checkDeliveryLocation,
} = require("../controllers/delivery.controller");

const router = express.Router();

router.post("/check-location", checkDeliveryLocation);

module.exports = router;
