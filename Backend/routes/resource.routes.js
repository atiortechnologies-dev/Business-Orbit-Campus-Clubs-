/**
 * @file resource.routes.js
 * @description Defines endpoints for students to list and fetch educational/startup resources.
 * @architecture Enforces student role access for resource operations.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole, requireVerified } = require("../middlewares/authMiddleware");
const {
  listResources,
  getResourceById,
} = require("../controllers/resource.controller");

router.use(protect, requireVerified, requireRole("student"));

router.get("/", listResources);
router.get("/:id", getResourceById);

/**
 * @module resourceRouter
 * @description Express router for resource endpoints.
 */
module.exports = router;
