const asyncHandler = require("../middlewares/asyncHandler");
const CustomerFeedback = require("../models/CustomerFeedback");
const ProductSubmission = require("../models/ProductSubmission");
const StartupStage = require("../models/StartupStage");
const TractionMetrics = require("../models/TractionMetrics");
const TractionReview = require("../models/TractionReview");
const { getOrCreateStartup } = require("../utils/startupJourney");

// ========= SCREEN 1: STAGE INITIALIZATION =========

const getStage4Overview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = getOrCreateStartup(userId, `${userId}'s Startup`);

  // verify stage4 unlocked
  const stage4 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 4,
  }).lean();

  if (!stage4 || stage4.status === "Locked") {
    return res.status(403).json({
      success: false,
      message: "Stage 4 is not yet unlocked. Complete earlier stages first.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      stage: {
        number: 4,
        name: "Traction & Growth",
        status: stage4.status,
        started_at: stage4.started_at,
      },
      objectives: [
        "Track user acquisition metrics",
        "Collect customer feedback",
        "Iterate and improve product",
        "Demonstrate market traction",
      ],
      timeline: "6-12 months",
    },
  });
});

const getStage4Progress = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const metrics = await TractionMetrics.findOne({
    startup_id: startup._id,
  }).lean();
  const feedback = await CustomerFeedback.find({
    startup_id: startup._id,
  }).lean();
  const submission = await ProductSubmission.findOne({
    startup_id: startup._id,
  }).lean();
  const review = await TractionReview.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      metrics_saved: !!metrics && metrics.status === "Submitted",
      feedback_collected: feedback.length > 0,
      product_submitted:
        !!submission && submission.submission_status !== "Draft",
      review_completed: !!review && review.review_status === "Approved",
      progress_percentage:
        [!!metrics, feedback.length > 0, !!submission, !!review].filter(Boolean)
          .length * 25,
    },
  });
});

const startStage4 = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const stage4 = await StartupStage.findOneAndUpdate(
    { startup_id: startup._id, stage_number: 4 },
    { status: "active", started_at: new Date() },
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Stage 4 started successfully",
    data: { stage: 4, status: stage4.status },
  });
});

const getStage4Checklist = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      items: [
        { name: "Track user metrics", is_completed: false },
        { name: "Collect customer feedback", is_completed: false },
        { name: "Submit improved product", is_completed: false },
        { name: "Complete traction review", is_completed: false },
      ],
    },
  });
});

// ========= SCREEN 2: USER ACQUISITION TRACKER =========

const submitMetrics = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const metricsData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let metrics = await TractionMetrics.findOne({ startup_id: startup._id });

  if (!metrics) {
    metrics = new TractionMetrics({
      startup_id: startup._id,
      student_id: userId,
      ...metricsData,
      status: "Submitted",
      submitted_at: new Date(),
    });
  } else {
    Object.assign(metrics, metricsData);
    metrics.status = "Submitted";
    metrics.submitted_at = new Date();
  }

  await metrics.save();

  res.status(201).json({
    success: true,
    message: "Metrics submitted successfully",
    data: { metric_id: metrics.metric_id },
  });
});

const getMetrics = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const metrics = await TractionMetrics.findOne({
    startup_id: startup._id,
  }).lean();

  if (!metrics) {
    return res
      .status(404)
      .json({ success: false, message: "No metrics found" });
  }

  res.status(200).json({ success: true, data: metrics });
});

const updateMetrics = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { metricId } = req.params;
  const updateData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const metrics = await TractionMetrics.findOneAndUpdate(
    { metric_id: metricId, startup_id: startup._id },
    updateData,
    { new: true },
  );

  if (!metrics) {
    return res
      .status(404)
      .json({ success: false, message: "Metrics not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Metrics updated", data: metrics });
});

const deleteMetrics = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { metricId } = req.params;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  await TractionMetrics.deleteOne({
    metric_id: metricId,
    startup_id: startup._id,
  });

  res.status(200).json({ success: true, message: "Metrics deleted" });
});

// ========= SCREEN 3: CUSTOMER FEEDBACK =========

const submitFeedback = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const feedbackData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const feedback = new CustomerFeedback({
    startup_id: startup._id,
    student_id: userId,
    ...feedbackData,
  });

  await feedback.save();

  res.status(201).json({
    success: true,
    message: "Feedback submitted",
    data: { feedback_id: feedback.feedback_id },
  });
});

const getFeedback = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const feedback = await CustomerFeedback.find({
    startup_id: startup._id,
  }).lean();

  const stats = {
    total: feedback.length,
    average_rating: feedback.length
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        ).toFixed(2)
      : 0,
    important_count: feedback.filter((f) => f.is_important).length,
  };

  res.status(200).json({ success: true, data: feedback, stats });
});

const getFeedbackById = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const feedback = await CustomerFeedback.findOne({
    feedback_id: feedbackId,
    startup_id: startup._id,
  }).lean();

  if (!feedback) {
    return res
      .status(404)
      .json({ success: false, message: "Feedback not found" });
  }

  res.status(200).json({ success: true, data: feedback });
});

const updateFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { id: userId } = req.user;
  const updateData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const feedback = await CustomerFeedback.findOneAndUpdate(
    { feedback_id: feedbackId, startup_id: startup._id },
    updateData,
    { new: true },
  );

  if (!feedback) {
    return res
      .status(404)
      .json({ success: false, message: "Feedback not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Feedback updated", data: feedback });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  await CustomerFeedback.deleteOne({
    feedback_id: feedbackId,
    startup_id: startup._id,
  });

  res.status(200).json({ success: true, message: "Feedback deleted" });
});

// ========= SCREEN 4: PRODUCT SUBMISSION =========
const submitProduct = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const productData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let submission = await ProductSubmission.findOne({ startup_id: startup._id });

  if (!submission) {
    submission = new ProductSubmission({
      startup_id: startup._id,
      student_id: userId,
      ...productData,
      submission_status: "Submitted",
      submitted_at: new Date(),
    });
  } else {
    Object.assign(submission, productData);
    submission.submission_status = "Submitted";
    submission.submitted_at = new Date();
  }

  await submission.save();

  res.status(201).json({
    success: true,
    message: "Product submitted",
    data: { submission_id: submission.submission_id },
  });
});

const getProductSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await ProductSubmission.findOne({
    startup_id: startup._id,
  }).lean();

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "No submission found" });
  }

  res.status(200).json({ success: true, data: submission });
});

const updateProductSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { submissionId } = req.params;
  const updateData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await ProductSubmission.findOneAndUpdate(
    {
      submission_id: submissionId,
      startup_id: startup._id,
      submission_status: "Draft",
    },
    updateData,
    { new: true },
  );

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: "Submission not found or cannot be updated",
    });
  }

  res
    .status(200)
    .json({ success: true, message: "Submission updated", data: submission });
});

// upload document route leaved for now

const deleteDocument = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { documentId } = req.params;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  await ProductSubmission.updateOne(
    { startup_id: startup._id },
    { $pull: { documents: { file_id: documentId } } },
  );

  res.status(200).json({ success: true, message: "Document deleted" });
});

// ========= SCREEN 5: TRACTION REVIEW =========
const getReview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const review = await TractionReview.findOne({ startup_id: startup._id })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!review) {
    return res.status(404).json({ success: false, message: "No review found" });
  }

  res.status(200).json({ success: true, data: review });
});

const getReviewStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const review = await TractionReview.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      status: review?.review_status || "Pending",
      score: review?.score,
      reviewer_notes: review?.review_notes,
    },
  });
});

const getReviewTimeline = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const review = await TractionReview.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      submitted: review?.created_at,
      under_review:
        review?.review_status === "Under Review" ? new Date() : null,
      completed: review?.updated_at,
    },
  });
});

const getReviewComments = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const review = await TractionReview.findOne({
    startup_id: startup._id,
  }).lean();

  if (!review) {
    return res.status(404).json({ success: false, message: "No review found" });
  }

  res.status(200).json({
    success: true,
    data: {
      review_notes: review.review_notes,
      strengths: review.strengths,
      improvement_areas: review.improvement_areas,
    },
  });
});

module.exports = {
  getStage4Overview,
  getStage4Progress,
  startStage4,
  getStage4Checklist,
  submitMetrics,
  getMetrics,
  updateMetrics,
  deleteMetrics,
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  submitProduct,
  getProductSubmission,
  updateProductSubmission,
  deleteDocument,
  getReview,
  getReviewStatus,
  getReviewTimeline,
  getReviewComments,
};
