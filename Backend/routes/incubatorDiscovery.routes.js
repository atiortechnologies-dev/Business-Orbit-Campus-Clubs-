/**
 * @file incubatorDiscovery.routes.js
 * @description API routes for Incubator Discovery, Search, and Filtering.
 * @architecture Exposes endpoints for listing and viewing incubation programs.
 */

const express = require("express");
const router = express.Router();
const { validateRequest } = require("../middlewares/validateRequest");
const {
  filterIncubatorsSchema,
} = require("../middlewares/validators/incubationValidators");
const {
  getIncubators,
  filterIncubators,
  getIncubatorById,
} = require("../controllers/incubatorDiscovery.controller");

// @route   GET /api/incubators
// @desc    Get all approved incubators with optional search, filter, sort, pagination
// @access  Public / Student
router.get("/", getIncubators);

// @route   POST /api/incubators/filter
// @desc    Filter incubators via body payload
// @access  Public / Student
router.post(
  "/filter",
  validateRequest(filterIncubatorsSchema, "body"),
  filterIncubators,
);

// @route   GET /api/incubators/:id
// @desc    Get complete incubator detail by ID
// @access  Public / Student
router.get("/:id", getIncubatorById);

module.exports = router;
