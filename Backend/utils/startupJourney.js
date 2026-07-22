const Startup = require("../model/Startup");
const StartupStage = require("../model/StartupStage");
const { STAGE_DEFINITIONS } = require("./stageDefinitions");

const getOrCreateStartup = async (userId, defaultStartupName) => {
  let startup = await Startup.findOne({ student_id: userId });
  if (startup) return startup;

  try {
    startup = await Startup.create({
      student_id: userId,
      startup_name: defaultStartupName,
      current_stage: 1,
      progress_percentage: 0,
    });
  } catch (err) {
    if (err.code === 11000) return Startup.findOne({ student_id: userId });
    throw err;
  }

  const stageRows = STAGE_DEFINITIONS.map((def) => ({
    startup_id: startup._id,
    stage_number: def.stage_number,
    stage_name: def.stage_name,
    status: def.stage_number === 1 ? "active" : "locked",
    started_at: def.stage_number === 1 ? new Date() : null,
  }));
  await StartupStage.insertMany(stageRows);

  return startup;
};

const recalcProgress = async (startupId) => {
  const total = STAGE_DEFINITIONS.length;
  const approvedCount = await StartupStage.countDocuments({
    startup_id: startupId,
    status: "approved",
  });
  const progress_percentage = Math.round((approvedCount / total) * 100);
  await Startup.findByIdAndUpdate(startupId, { progress_percentage });
  return progress_percentage;
};

module.exports = { getOrCreateStartup, recalcProgress };
