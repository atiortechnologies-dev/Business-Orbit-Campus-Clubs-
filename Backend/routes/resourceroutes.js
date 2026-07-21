const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.use(protect, requireRole("student"));

router.get("/", resourceController.listResources);
router.get("/:id", resourceController.getResourceById);

module.exports = router;
