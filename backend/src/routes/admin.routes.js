const express = require("express");
const {
  assignCourier,
  deleteOrder,
  getOrder,
  getOverview,
  listCouriers,
  listOrders,
  listRestaurants,
  listUsers,
  updateOrderStatus,
} = require("../controllers/admin.controller");
const { requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

// Everything below is admin-only.
router.use(requireRole("ADMIN"));

router.get("/overview", getOverview);
router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/courier", assignCourier);
router.delete("/orders/:id", deleteOrder);
router.get("/restaurants", listRestaurants);
router.get("/users", listUsers);
router.get("/couriers", listCouriers);

module.exports = router;
