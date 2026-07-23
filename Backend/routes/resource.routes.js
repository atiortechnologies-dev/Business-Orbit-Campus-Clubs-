const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  listResources,
  getResourceById,
} = require("../controllers/resource.controller");

router.use(protect, requireRole("student"));

router.get("/", listResources);
router.get("/:id", getResourceById);

module.exports = router;
