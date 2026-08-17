const express = require("express");
const {
  cancelOrder,
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
router.post("/:id/cancel", cancelOrder);

module.exports = router;
