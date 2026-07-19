const {
  roleSpecificCompleteSchemas,
  commonProfileFields,
} = require("../utils/validators");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../model/User");
const roleConfig = require("../utils/roleConfig");

const buildProfileSchema = (role, { partial = false } = {}) => {
  const roleSchema = roleSpecificCompleteSchemas[role];
  if (!roleSchema) return null;
  const merged = commonProfileFields.merge(roleSchema);
  return partial ? merged.partial() : merged;
};

const validateBody = (schema, req, res) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    //! don't leave an orphaned upload behind if the rest of the form failed validation

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
    return null;
  }
  return result.data;
};

const createProfile = asyncHandler(async (req, res) => {
  const { role, id: userId, account_status, email_verified } = req.user;
  const config = roleConfig[role];

  if (!email_verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before completing your profile",
    });
  }
  if (account_status !== "active") {
    return res
      .status(403)
      .json({ success: false, message: "Your account is not yet approved" });
  }

  const schema = buildProfileSchema(role);
  const data = validateBody(schema, req, res);
  if (!data) return;

  const ProfileModel = config.ProfileModel;
  let profile = await ProfileModel.findOne({ user_id: userId });

  if (profile && profile.profile_status === "completed") {
    return res.status(409).json({
      success: false,
      message: "Profile already completed. Use PUT to update it instead.",
    });
  }
  if (!profile) {
    profile = new ProfileModel({ user_id: userId });
  }

  profile.bio = data.bio;
  profile.skills = data.skills;
  profile.linkedin_url = data.linkedin_url;
  profile.portfolio_url = data.portfolio_url || "";
  profile.profile_photo = data.profile_photo || "";

  const roleFieldNames = Object.keys(roleSpecificCompleteSchemas[role].shape);
  for (const field of roleFieldNames) {
    profile[field] = data[field];
  }

  profile.profile_status = "completed";
  profile.profile_completed_at = new Date();
  await profile.save();

  await User.findByIdAndUpdate(userId, { profile_status: "completed" });

  return res.status(201).json({
    success: true,
    message: "Profile completed successfully",
    data: {
      profile_status: profile.profile_status,
      redirect_to: config.dashboardRedirect,
    },
  });
});

const skipProfile = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const config = roleConfig[role];
  const ProfileModel = config.ProfileModel;

  let profile = await ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    profile = await ProfileModel.create({ user_id: userId });
  }

  await User.findByIdAndUpdate(userId, { profile_status: "skipped" });

  return res.status(200).json({
    success: true,
    message: "You can complete your profile later from Profile Settings",
    data: {
      profile_status: profile.profile_status,
      redirect_to: config.dashboardRedirect,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const config = roleConfig[role];
  const ProfileModel = config.ProfileModel;

  const schema = buildProfileSchema(role, { partial: true });
  const data = validateBody(schema, req, res);
  if (!data) return;

  const profile = await ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found. Complete your profile first.",
    });
  }

  Object.assign(profile, data);

  await profile.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const config = roleConfig[role];

  const profile = await config.ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }

  return res.status(200).json({ success: true, data: profile });
});

module.exports = {
  createProfile,
  skipProfile,
  updateProfile,
  getMyProfile,
};
