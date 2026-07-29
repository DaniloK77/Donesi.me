const express = require("express");
const {
  getStreets,
} = require("../controllers/streets.controller");

const router = express.Router();

router.get("/", getStreets);

module.exports = router;
