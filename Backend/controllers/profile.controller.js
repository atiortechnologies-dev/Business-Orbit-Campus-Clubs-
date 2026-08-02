/**
 * @file profile.controller.js
 * @description Centralizes profile management for all user roles.
 * @architecture Dynamically constructs validation schemas based on user role and allows creating/updating role-specific profiles.
 */

const {
  roleSpecificCompleteSchemas,
  commonProfileFields,
} = require("../utils/validators");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const roleConfig = require("../utils/roleConfig");
const { hashPassword, comparePassword } = require("../utils/password");

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

/**
 * @desc    Create a role-specific profile for the authenticated user
 * @route   POST /api/profiles
 * @access  Private
 */
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

  // 1. Fetch existing profile created during registration
  let profile = await ProfileModel.findOne({ user_id: userId });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Initial profile not found. Please re-register.",
    });
  }

  if (profile.profile_status === "completed") {
    return res.status(409).json({
      success: false,
      message: "Profile already completed. Use PUT to update it instead.",
    });
  }

  // 2. Assign onboarding fields to the existing document (preserving college, degree, grad year)
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

  // 3. Save existing profile
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

/**
 * @desc    Skip the profile creation step during onboarding
 * @route   POST /api/profiles/skip
 * @access  Private
 */
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

/**
 * @desc    Update the user's role-specific profile
 * @route   PUT /api/profiles
 * @access  Private
 */
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

/**
 * @desc    Get the authenticated user's role-specific profile
 * @route   GET /api/profiles/me
 * @access  Private
 */
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

/**
 * @desc    Change user password
 * @route   PUT /api/profiles/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: "Current and new passwords are required" });
  }
  
  const user = await User.findById(req.user.id).select("+password_hash");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await comparePassword(current_password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Incorrect current password" });
  }

  user.password_hash = await hashPassword(new_password);
  await user.save();

  return res.status(200).json({ success: true, message: "Password updated successfully" });
});

/**
 * @desc    Update notification preferences
 * @route   PUT /api/profiles/notification-preferences
 * @access  Private
 */
const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const config = roleConfig[role];
  const ProfileModel = config.ProfileModel;

  const profile = await ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found" });
  }

  if (req.body.notification_preferences) {
    profile.notification_preferences = {
      ...profile.notification_preferences,
      ...req.body.notification_preferences
    };
    await profile.save();
  }

  return res.status(200).json({ success: true, message: "Notification preferences updated", data: profile.notification_preferences });
});

/**
 * @desc    Upload profile photo
 * @route   POST /api/profiles/upload-photo
 * @access  Private
 */
const uploadPhoto = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const config = roleConfig[role];
  const ProfileModel = config.ProfileModel;
  
  // This is a stub for the actual photo upload logic (e.g. S3 / Cloudinary)
  const { photo_url } = req.body; // Assume frontend uploads and passes URL, or we handle req.file here
  
  if (!photo_url) {
    return res.status(400).json({ success: false, message: "Photo URL is required" });
  }

  const profile = await ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found" });
  }

  profile.profile_photo = photo_url;
  await profile.save();

  return res.status(200).json({ success: true, message: "Photo uploaded successfully", data: { profile_photo: photo_url } });
});

module.exports = {
  createProfile,
  skipProfile,
  updateProfile,
  getMyProfile,
  changePassword,
  updateNotificationPreferences,
  uploadPhoto,
};
