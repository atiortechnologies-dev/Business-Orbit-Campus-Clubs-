/**
 * @file startupJourney.js
 * @description Helper functions for managing the lifecycle of a startup.
 * @architecture Provides logic to safely initialize a startup's stages and recalculate their overall completion percentage.
 */

const Chapter = require("../models/Chapter");
const Startup = require("../models/Startup");
const StartupStage = require("../models/StartupStage");
const StudentProfile = require("../models/StudentProfile");
const { STAGE_DEFINITIONS } = require("./stageDefinitions");

/**
 * @desc    Fetch a startup for a user or create a new one with initialized stages
 * @param   {string} userId - ID of the student user
 * @param   {string} defaultStartupName - Default name to use if creating
 * @returns {Promise<Object>} The startup document
 */
const getOrCreateStartup = async (userId, defaultStartupName) => {
  // 1. Return existing startup if found
  let startup = await Startup.findOne({ student_id: userId });
  if (startup) return startup;

  // 2. Fetch student profile safely
  const student = await StudentProfile.findOne({ user_id: userId });
  const chapterId = student?.chapter_id || null;

  // 3. Fetch chapter safely
  let chapterName = "";
  if (chapterId) {
    const chapter = await Chapter.findById(chapterId);
    chapterName = chapter?.chapter_name || "";
  }

  // 4. Create Startup document safely
  try {
    startup = await Startup.create({
      student_id: userId,
      chapter_id: chapterId,
      chapter: chapterName,
      startup_name: defaultStartupName || "Untitled Startup",
      current_stage: 1,
      stage: STAGE_DEFINITIONS[0]?.stage_name || "ideation",
      progress_percentage: 0,
    });
  } catch (err) {
    // Handle race condition for duplicate student_id index
    if (err.code === 11000) return Startup.findOne({ student_id: userId });
    throw err;
  }

  // 5. Initialize stages for the new startup
  if (Array.isArray(STAGE_DEFINITIONS) && STAGE_DEFINITIONS.length > 0) {
    const stageRows = STAGE_DEFINITIONS.map((def) => ({
      startup_id: startup._id,
      stage_number: def.stage_number,
      stage_name: def.stage_name,
      status: def.stage_number === 1 ? "active" : "locked",
      started_at: def.stage_number === 1 ? new Date() : null,
    }));

    try {
      await StartupStage.insertMany(stageRows);
    } catch (stageErr) {
      console.error("Failed to initialize startup stages:", stageErr);
      // Non-blocking catch to ensure startup doc is still returned
    }
  }

  return startup;
};

/**
 * @desc    Recalculate the overall progress percentage for a startup based on approved stages
 * @param   {string} startupId - ID of the startup
 * @returns {Promise<number>} The new progress percentage
 */
const recalcProgress = async (startupId) => {
  const total = STAGE_DEFINITIONS?.length || 1;
  const approvedCount = await StartupStage.countDocuments({
    startup_id: startupId,
    status: "approved",
  });

  const progress_percentage = Math.min(
    Math.round((approvedCount / total) * 100),
    100,
  );

  await Startup.findByIdAndUpdate(startupId, { progress_percentage });
  return progress_percentage;
};

module.exports = { getOrCreateStartup, recalcProgress };
