/**
 * @file meeting.controller.js
 * @description Controller for admin meeting operations.
 */

const ReviewMeeting = require("../../models/ReviewMeeting");
const Startup = require("../../models/Startup");
const StageSubmission = require("../../models/StageSubmission");

exports.prepareMeetingContext = async (req, res) => {
  try {
    const { startup_id, submission_id } = req.query;

    if (!startup_id && !submission_id) {
      return res.status(400).json({ success: false, message: "startup_id or submission_id is required" });
    }

    let startupId = startup_id;
    let submission = null;

    if (submission_id) {
      submission = await StageSubmission.findById(submission_id);
      if (!submission) {
        return res.status(404).json({ success: false, message: "Submission not found" });
      }
      startupId = submission.startup_id;
    }

    const startup = await Startup.findById(startupId).populate("student_id", "name email");
    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    const historicalSubmissions = await StageSubmission.find({ startup_id: startupId })
      .sort({ created_at: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        startup,
        student: startup.student_id,
        currentSubmission: submission,
        historicalSubmissions
      }
    });
  } catch (error) {
    console.error("Error in prepareMeetingContext:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.scheduleMeeting = async (req, res) => {
  try {
    const { startup_id, student_id, meeting_date, agenda, meeting_link } = req.body;

    if (!startup_id || !student_id || !meeting_date) {
      return res.status(400).json({ success: false, message: "startup_id, student_id, and meeting_date are required" });
    }

    const reviewer_id = req.user._id;

    // Edge Case: Check for double booking
    const existingMeeting = await ReviewMeeting.findOne({
      student_id,
      status: "scheduled"
    });

    if (existingMeeting) {
      return res.status(400).json({ success: false, message: "A meeting is already scheduled for this student." });
    }

    // Fallback to fetch latest submission if stage_submission_id not explicitly sent
    let submissionId = req.body.stage_submission_id;
    if (!submissionId) {
      const latestSubmission = await StageSubmission.findOne({ startup_id }).sort({ created_at: -1 });
      if (!latestSubmission) {
        return res.status(400).json({ success: false, message: "No stage submission found for this startup to link to the meeting." });
      }
      submissionId = latestSubmission._id;
    }

    const newMeeting = new ReviewMeeting({
      stage_submission_id: submissionId,
      startup_id,
      student_id,
      reviewer_id,
      meeting_date,
      meeting_link: meeting_link || "",
      agenda: agenda || "",
      status: "scheduled"
    });

    await newMeeting.save();

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      data: newMeeting
    });
  } catch (error) {
    console.error("Error in scheduleMeeting:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
