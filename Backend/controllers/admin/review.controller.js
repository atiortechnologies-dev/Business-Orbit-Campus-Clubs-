/**
 * @file review.controller.js
 * @description Admin controller for managing the review queue and individual submissions.
 * @architecture Accessible only to admins to oversee startup stage submissions and assign reviewers.
 */

const asyncHandler = require("../../middlewares/asyncHandler");
const StageSubmission = require("../../models/StageSubmission");

const calculatePriority = (submittedAt) => {
  if (!submittedAt) return "Low";
  const daysWaiting = (new Date() - new Date(submittedAt)) / (1000 * 60 * 60 * 24);
  if (daysWaiting > 7) return "High";
  if (daysWaiting > 3) return "Medium";
  return "Low";
};

const mapStatus = (status, assignedReviewerId) => {
  if (status === "pending_review") {
    return assignedReviewerId ? "Under Review" : "Pending";
  }
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Draft";
};

/**
 * @desc    Get the review queue for admins
 * @route   GET /api/admin/reviews
 * @access  Private (Admin)
 */
const getReviewQueue = asyncHandler(async (req, res) => {
  // Fetch pending_review submissions
  const submissions = await StageSubmission.find({
    status: { $in: ["pending_review"] },
  })
    .populate({
      path: "startup_id",
      select: "startup_name chapter student_id",
      populate: {
        path: "student_id",
        select: "full_name",
      },
    })
    .populate({
      path: "stage_id",
      select: "stage_name",
    })
    .populate({
      path: "assigned_reviewer_id",
      select: "full_name",
    })
    .sort({ submitted_at: 1 }); // oldest first

  // Format response for the frontend table
  const formattedSubmissions = submissions.map((sub) => {
    return {
      id: sub._id,
      name: sub.startup_id?.startup_name || "Unknown Startup",
      founder: sub.startup_id?.student_id?.full_name || "Unknown Founder",
      chapter: sub.startup_id?.chapter || "N/A",
      stage: sub.stage_id?.stage_name || "Unknown Stage",
      date: sub.submitted_at ? new Date(sub.submitted_at).toISOString().split("T")[0] : "N/A",
      reviewer: sub.assigned_reviewer_id?.full_name || "Unassigned",
      priority: calculatePriority(sub.submitted_at),
      status: mapStatus(sub.status, sub.assigned_reviewer_id),
    };
  });

  return res.status(200).json({
    success: true,
    data: formattedSubmissions,
  });
});

/**
 * @desc    Get details of a specific submission
 * @route   GET /api/admin/reviews/:id
 * @access  Private (Admin)
 */
const getSubmissionDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await StageSubmission.findById(id)
    .populate({
      path: "startup_id",
      select: "startup_name chapter category idea",
      populate: {
        path: "student_id",
        select: "full_name email",
      },
    })
    .populate({
      path: "stage_id",
      select: "stage_name stage_number",
    })
    .populate({
      path: "assigned_reviewer_id",
      select: "full_name email",
    });

  if (!submission) {
    return res.status(404).json({ success: false, message: "Submission not found" });
  }

  return res.status(200).json({
    success: true,
    data: submission,
  });
});

/**
 * @desc    Submit a review decision for a submission
 * @route   POST /api/admin/reviews/:id/decision
 * @access  Private (Admin)
 */
const submitReviewDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision, feedback: _feedback, improvement_suggestions: _improvement_suggestions } = req.validatedData || req.body;

  const submission = await StageSubmission.findById(id);

  if (!submission) {
    return res.status(404).json({ success: false, message: "Submission not found" });
  }

  submission.status = decision === "approved" ? "approved" : "rejected";
  await submission.save();

  return res.status(200).json({
    success: true,
    message: "Review decision recorded successfully",
    data: submission,
  });
});

module.exports = {
  getReviewQueue,
  getSubmissionDetail,
  submitReviewDecision,
};
