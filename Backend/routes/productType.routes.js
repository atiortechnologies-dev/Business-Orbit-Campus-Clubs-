const express = require("express");
const router = express.Router();

const { selectProductTypeSchema } = require("../utils/validators");
const {
  selectProductType,
  getProductType,
} = require("../controllers/productType.controller");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");

router.use(requireAuth, requireRole("student"));

router.post(
  "/startup/product-type",
  validateRequest(selectProductTypeSchema),
  selectProductType,
);
router.get("/startup/product-type", getProductType);

module.exports = router;
