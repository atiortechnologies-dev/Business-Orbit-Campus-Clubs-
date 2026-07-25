const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const { validateRequest } = require("../../middlewares/validateRequest");

const { selectProductTypeSchema } = require("../utils/validators");
const {
  selectProductType,
  getProductType,
} = require("../controllers/productType.controller");

router.use(protect, requireRole("student"));

router.post(
  "/startup/product-type",
  validateRequest(selectProductTypeSchema),
  selectProductType,
);
router.get("/startup/product-type", getProductType);

module.exports = router;
