const express = require("express");
const {
  forgotPassword,
  login,
  logout,
  me,
  notImplemented,
  refresh,
  register,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const authRateLimit = require("../middleware/auth-rate-limit");

const router = express.Router();

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/refresh", requireAuth, refresh);
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/reset-password", notImplemented);
router.post("/verify-email", notImplemented);

module.exports = router;
