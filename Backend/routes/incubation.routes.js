const express = require("express");
const { validateRequest } = require("../middlewares/validateRequest");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const incubationController = require("../controllers/incubation.controller");
const {
  submitIncubationSchema,
  updateIncubationSchema,
} = require("../utils/validators");

router.use(protect, requireRole("student"));

// SCREEN 1: INCUBATION VERIFICATION SUBMISSION
router.post(
  "/incubation-verification",
  validateRequest(submitIncubationSchema),
  incubationController.submitIncubationVerification,
);

router.get(
  "/incubation-verification",
  incubationController.getIncubationVerification,
);

router.put(
  "/incubation-verification/:verificationId",
  validateRequest(updateIncubationSchema),
  incubationController.updateIncubationverification,
);

// leaved for now
// router.post(
//   "/incubation-verification/upload",
//   validateRequest(uploadDocumentSchema),
//   incubationController.uploadDocument
// );

module.exports = router;
