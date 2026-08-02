const express = require("express");
const router = express.Router();

const {
  mvpSubmissionSchema,
  updateMVPSubmissionSchema,
} = require("../utils/validators");
const {
  getMVPSubmission,
  updateMVPSubmission,
  submitMVP,
} = require("../controllers/mvpSubmission.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");

router.use(protect, requireRole("student"));

router.post("/mvp/submit", validateRequest(mvpSubmissionSchema), submitMVP);

router.get("/mvp", getMVPSubmission);

router.put(
  "/mvp",
  validateRequest(updateMVPSubmissionSchema),
  updateMVPSubmission,
);

module.exports = router;
