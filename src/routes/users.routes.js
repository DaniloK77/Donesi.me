const express = require("express");
const {
  changePassword,
  deleteAccount,
  updateProfile,
} = require("../controllers/users.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.patch("/me", requireAuth, updateProfile);
router.patch("/me/password", requireAuth, changePassword);
router.delete("/me", requireAuth, deleteAccount);

module.exports = router;
