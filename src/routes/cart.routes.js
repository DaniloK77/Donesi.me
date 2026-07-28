const express = require("express");
const {
  addCartItem,
  clearCart,
  createCart,
  getCart,
  removeCartItem,
  updateCartItem,
} = require("../controllers/cart.controller");

const router = express.Router();

router.post("/", createCart);
router.get("/:cartId", getCart);
router.post("/:cartId/items", addCartItem);
router.delete("/:cartId/items", clearCart);
router.patch("/:cartId/items/:menuItemId", updateCartItem);
router.delete("/:cartId/items/:menuItemId", removeCartItem);

module.exports = router;
