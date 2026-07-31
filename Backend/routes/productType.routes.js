/**
 * @file productType.routes.js
 * @description Routes for selecting and retrieving product types.
 * @architecture Manages endpoints related to product type selection for student startups.
 */
const express = require("express");
/**
 * @desc    Product Type routing module
 * @route   /api/product-type
 * @access  Private (Student)
 */
const router = express.Router();

const { selectProductTypeSchema } = require("../utils/validators");
const {
  selectProductType,
  getProductType,
} = require("../controllers/productType.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");

router.use(protect, requireRole("student"));

router.post(
  "/startup/product-type",
  validateRequest(selectProductTypeSchema),
  selectProductType,
);
router.get("/startup/product-type", getProductType);

module.exports = router;
