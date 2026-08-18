const express = require("express");
const {
  assignCourier,
  createMenuCategory,
  createMenuItem,
  deleteCourier,
  deleteMenuCategory,
  deleteMenuItem,
  deleteOrder,
  deleteUser,
  getOrder,
  getOverview,
  listCouriers,
  listOrders,
  listRestaurants,
  listUsers,
  renameMenuCategory,
  updateCourier,
  updateMenuItem,
  updateOrderStatus,
  uploadMenuImage,
} = require("../controllers/admin.controller");
const { requireRole } = require("../middleware/auth.middleware");
const {
  handleMenuImageUpload,
} = require("../middleware/upload.middleware");

const router = express.Router();

// Everything below is admin-only.
router.use(requireRole("ADMIN"));

router.get("/overview", getOverview);

router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/courier", assignCourier);
router.delete("/orders/:id", deleteOrder);

router.post("/uploads/menu-image", handleMenuImageUpload, uploadMenuImage);

router.get("/restaurants", listRestaurants);
router.post("/restaurants/:id/menu-categories", createMenuCategory);
router.patch("/restaurants/:id/menu-categories/:categoryId", renameMenuCategory);
router.delete("/restaurants/:id/menu-categories/:categoryId", deleteMenuCategory);
router.post("/restaurants/:id/menu-items", createMenuItem);
router.patch("/restaurants/:id/menu-items/:itemId", updateMenuItem);
router.delete("/restaurants/:id/menu-items/:itemId", deleteMenuItem);

router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);

router.get("/couriers", listCouriers);
router.patch("/couriers/:id", updateCourier);
router.delete("/couriers/:id", deleteCourier);

module.exports = router;
