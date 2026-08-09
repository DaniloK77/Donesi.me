const express = require("express");
const {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} = require("../controllers/addresses.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", listAddresses);
router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
