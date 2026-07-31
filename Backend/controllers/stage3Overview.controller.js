/**
 * @file stage3Overview.controller.js
 * @description Manages Stage 3 (MVP Development) overview and checklist.
 * @architecture Handles fetching Stage 3 status, checklist, and calculating progress for startups.
 */
const asyncHandler = require("../middlewares/asyncHandler");
const MVPChecklist = require("../models/MVPChecklist");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");

// GET /api/student/stages/mvp
/**
 * @desc    Get Stage 3 (MVP) overview
 * @route   GET /api/student/stages/mvp
 * @access  Private/Student
 */
const getMVPStageOverview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check if Stage 2 is approved
  const stage2 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 2,
  }).lean();

  if (!stage2 || stage2.status !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Stage 2 (Validation) must be completed first",
    });
  }

  // Get Stage 3 info
  const stage3 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 3,
  }).lean();

  // Get or create checklist
  let checklist = await MVPChecklist.findOne({ startup_id: startup._id });

  if (!checklist) {
    checklist = new MVPChecklist({
      startup_id: startup._id,
      student_id: userId,
      items: [
        { name: "Select Product Type", is_completed: false },
        { name: "Plan MVP", is_completed: false },
        { name: "Build MVP", is_completed: false },
        { name: "Request Atior Support", is_completed: false },
        { name: "Submit MVP", is_completed: false },
      ],
    });
    await checklist.save();
  }

  // Calculate progress
  const completedItems = checklist.items.filter(
    (item) => item.is_completed,
  ).length;
  const progressPercentage = Math.round(
    (completedItems / checklist.items.length) * 100,
  );

  res.status(200).json({
    success: true,
    data: {
      stage: {
        number: 3,
        name: "MVP Development",
        description: "Build and submit your Minimum Viable Product",
        status: stage3?.status || "active",
        started_at: stage3?.started_at,
      },
      learning_objectives: [
        "Understand MVP development best practices",
        "Build a functional prototype",
        "Get technical feedback from experts",
        "Prepare for product launch",
      ],
      estimated_duration: "30-45 days",
      checklist: checklist.items,
      progress_percentage: progressPercentage,
      available_resources: [
        {
          id: 1,
          title: "MVP Development Playbook",
          url: "/resources/mvp-playbook",
        },
        {
          id: 2,
          title: "No-Code Tools for MVP",
          url: "/resources/no-code-tools",
        },
        {
          id: 3,
          title: "Atior Technologies Partnership",
          url: "/resources/atior-partnership",
        },
      ],
    },
  });
});

// GET /api/student/stages/mvp/checklist
/**
 * @desc    Get Stage 3 (MVP) checklist
 * @route   GET /api/student/stages/mvp/checklist
 * @access  Private/Student
 */
const getMVPChecklist = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const checklist = await MVPChecklist.findOne({
    startup_id: startup._id,
  }).lean();

  if (!checklist) {
    return res.status(404).json({
      success: false,
      message: "Checklist not found",
    });
  }

  const completedItems = checklist.items.filter(
    (item) => item.is_completed,
  ).length;
  const progressPercentage = Math.round(
    (completedItems / checklist.items.length) * 100,
  );

  res.status(200).json({
    success: true,
    data: {
      items: checklist.items,
      progress_percentage: progressPercentage,
      completed_count: completedItems,
      total_count: checklist.items.length,
    },
  });
});

module.exports = {
  getMVPStageOverview,
  getMVPChecklist,
};
