/**
 * @file pitchSubmission.controller.js
 * @description Controller for direct pitch submissions from startups to investors.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const PitchSubmission = require("../models/PitchSubmission");
const PitchDocument = require("../models/PitchDocument");
const mongoose = require("mongoose");
const Notification = require("../models/Notification"); // Optional based on existing logic

// ==========================================
// STUDENT/STARTUP ENDPOINTS
// ==========================================

/**
 * @desc    Submit a direct pitch to an investor
 * @route   POST /api/student/pitches
 */
exports.submitPitch = asyncHandler(async (req, res) => {
  const {
    startup_id,
    investor_id,
    funding_requirement,
    valuation,
    startup_stage,
    documents,
  } = req.body;

  if (!startup_id || !investor_id || !funding_requirement || !startup_stage) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if a submission already exists
    const existing = await PitchSubmission.findOne({
      startup_id,
      investor_id,
    }).session(session);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A pitch has already been submitted to this investor",
      });
    }

    const [submission] = await PitchSubmission.create(
      [
        {
          startup_id,
          investor_id,
          funding_requirement,
          valuation,
          startup_stage,
          status: "submitted",
        },
      ],
      { session },
    );

    if (documents && Array.isArray(documents)) {
      const docsToInsert = documents.map((doc) => ({
        submission_id: submission._id,
        document_type: doc.document_type || "pitch_deck",
        file_name: doc.file_name,
        file_url: doc.file_url,
      }));
      await PitchDocument.insertMany(docsToInsert, { session });
    }

    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: investor_id,
            title: "New Pitch Received",
            message: "A startup has submitted a new pitch deck to you.",
            type: "pitch_submission",
            related_id: submission._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get all direct pitches sent by the startup
 * @route   GET /api/student/pitches
 */
exports.getMyPitches = asyncHandler(async (req, res) => {
  const { startup_id } = req.query; // Assuming startup_id is passed as query, or we can fetch from User if 1:1

  const query = startup_id ? { startup_id } : {};
  // Ideally, if a student can have multiple startups, filter by startup_id. If not, we might need to find startups by student first.

  const submissions = await PitchSubmission.find(query)
    .populate("investor_id", "full_name email")
    .populate("startup_id", "startup_name category")
    .sort({ submitted_at: -1 });

  res
    .status(200)
    .json({ success: true, count: submissions.length, data: submissions });
});

/**
 * @desc    Get details of a specific pitch (Student view)
 * @route   GET /api/student/pitches/:pitchId
 */
exports.getPitchDetailsStudent = asyncHandler(async (req, res) => {
  const { pitchId } = req.params;

  const submission = await PitchSubmission.findById(pitchId)
    .populate("investor_id", "full_name email")
    .populate("startup_id", "startup_name category");

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Pitch submission not found" });
  }

  const documents = await PitchDocument.find({ submission_id: pitchId });

  res.status(200).json({ success: true, data: { submission, documents } });
});

/**
 * @desc    Withdraw a pitch (if not viewed)
 * @route   DELETE /api/student/pitches/:pitchId
 */
exports.withdrawPitch = asyncHandler(async (req, res) => {
  const { pitchId } = req.params;

  const submission = await PitchSubmission.findById(pitchId);
  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Pitch submission not found" });
  }

  if (submission.status !== "draft" && submission.status !== "submitted") {
    return res.status(400).json({
      success: false,
      message: "Cannot withdraw a pitch that is already under review",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await PitchDocument.deleteMany({ submission_id: pitchId }, { session });
    await PitchSubmission.findByIdAndDelete(pitchId, { session });

    await session.commitTransaction();
    res
      .status(200)
      .json({ success: true, message: "Pitch withdrawn successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// ==========================================
// INVESTOR ENDPOINTS
// ==========================================

/**
 * @desc    Get all direct pitches received by the investor
 * @route   GET /api/investor/direct-pitches
 */
exports.getReceivedPitches = asyncHandler(async (req, res) => {
  const investorId = req.user._id;

  const submissions = await PitchSubmission.find({ investor_id: investorId })
    .populate("startup_id", "startup_name category stage")
    .sort({ submitted_at: -1 });

  res
    .status(200)
    .json({ success: true, count: submissions.length, data: submissions });
});

/**
 * @desc    Get details of a specific received pitch (Investor view)
 * @route   GET /api/investor/direct-pitches/:pitchId
 */
exports.getPitchDetailsInvestor = asyncHandler(async (req, res) => {
  const { pitchId } = req.params;
  const investorId = req.user._id;

  const submission = await PitchSubmission.findOne({
    _id: pitchId,
    investor_id: investorId,
  }).populate("startup_id", "startup_name category stage idea");

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Pitch submission not found" });
  }

  // Update status to viewed if it's currently submitted
  if (submission.status === "submitted") {
    submission.status = "viewed";
    await submission.save();
  }

  const documents = await PitchDocument.find({ submission_id: pitchId });

  res.status(200).json({ success: true, data: { submission, documents } });
});

/**
 * @desc    Update pitch status
 * @route   PATCH /api/investor/direct-pitches/:pitchId/status
 */
exports.updatePitchStatus = asyncHandler(async (req, res) => {
  const { pitchId } = req.params;
  const { status } = req.body;
  const investorId = req.user._id;

  const validStatuses = ["viewed", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const submission = await PitchSubmission.findOneAndUpdate(
    { _id: pitchId, investor_id: investorId },
    { status },
    { new: true },
  );

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Pitch submission not found" });
  }

  // Optionally send notification back to startup
  if (Notification) {
    // Find student_id of the startup
    const Startup = require("../models/Startup");
    const startup = await Startup.findById(submission.startup_id);
    if (startup) {
      await Notification.create({
        recipient_id: startup.student_id,
        title: "Pitch Status Updated",
        message: `Your pitch to an investor has been marked as ${status}.`,
        type: "pitch_update",
        related_id: submission._id,
      });
    }
  }

  res.status(200).json({ success: true, data: submission });
});
