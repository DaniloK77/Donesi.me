const express = require("express");
const {
  createOrder,
  getOrder,
  listOrders,
} = require("../controllers/orders.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);

module.exports = router;
