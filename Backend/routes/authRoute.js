const express = require("express");
const router = express.Router();

const registerSchema = require("../utils/validators");
const { validateRequest } = require("../middlewares/validateRequest");
const authController = require("../controllers/authController");

// POST /api/auth/register
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser,
);

module.exports = router;
