const StageSubmission = require("../model/StageSubmission");
const StartupStage = require("../model/StartupStage");

const processReview = async ({
  submissionId,
  reviewerId,
  decision,
  feedback,
  improvementSuggestions,
}) => {
  const submission = await StageSubmission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  if (submission.status !== "pending_review") {
    throw new Error(
      `Cannot review a submission with status "${submission.status}"`,
    );
  }

  const stage = await StartupStage.findById(submission.stage_id);
  if (!stage) throw new Error("Stage not found for this submission");

  const review = await Review.create({
    submission_id: submission._id,
    reviewer_id: reviewerId,
    decision,
    feedback: feedback || "",
    improvement_suggestions: improvementSuggestions || "",
    reviewed_at: new Date(),
  });

  submission.status = decision;
  await submission.save();

  if (decission === "approved") {
    stage.status = "approved";
    stage.completed_at = new Date();
    await stage.save();

    const nextStage = await StartupStage.findOne({
      startup_id: stage.startup_id,
      stage_number: stage.stage_number + 1,
    });

    if (nextStage) {
      nextStage.status = "active";
      nextStage.started_at = new Date();
      await nextStage.save();

      await Startup.findByIdAndUpdate(stage.startup_id, {
        current_stage: nextStage.stage_number,
      });
    }
  } else {
    // Rejected: reopen the SAME stage so the student can resubmit —
    stage.status = "active";
    await stage.save();
  }

  await recalcProgress(stage.startup_id);

  // Notify the student of the outcome.
  // Notification part if needed

  return review;
};

module.exports = { processReview };
