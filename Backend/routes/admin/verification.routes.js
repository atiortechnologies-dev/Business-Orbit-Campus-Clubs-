const express = require("express");
const router = express.Router();
const {
  getVerificationQueue,
  getVerificationDetails,
  submitDecision
} = require("../../controllers/admin/verification.controller");

router.get("/", getVerificationQueue);
router.get("/:id", getVerificationDetails);
router.post("/:id/decision", submitDecision);

module.exports = router;
