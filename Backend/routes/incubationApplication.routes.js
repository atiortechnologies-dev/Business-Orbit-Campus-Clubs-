/**
 * @file incubationApplication.routes.js
 * @description API routes for submitting, viewing, updating, and withdrawing Incubation Applications.
 * @architecture Enforces Zod payload validation and authentication before routing to controllers.
 */

const express = require("express");
const router = express.Router();
const { validateRequest } = require("../middlewares/validateRequest");
const {
  applyIncubationSchema,
  updateApplicationSchema,
} = require("../middlewares/validators/incubationValidators");
const {
  applyForIncubation,
  getApplicationById,
  updateApplication,
  withdrawApplication,
} = require("../controllers/incubationApplication.controller");

// @route   POST /api/incubation/apply
// @desc    Submit a new incubation application
// @access  Private / Student
router.post(
  "/apply",
  validateRequest(applyIncubationSchema, "body"),
  applyForIncubation,
);

// @route   GET /api/incubation/application/:id
// @desc    Get complete application details with timeline and docs
// @access  Private / Student or Incubator
router.get("/application/:id", getApplicationById);

// @route   PUT /api/incubation/application/:id
// @desc    Update application details (only if Submitted)
// @access  Private / Student
router.put(
  "/application/:id",
  validateRequest(updateApplicationSchema, "body"),
  updateApplication,
);

// @route   POST /api/incubation/withdraw
// @desc    Withdraw an active application
// @access  Private / Student
router.post("/withdraw", withdrawApplication);

module.exports = router;
