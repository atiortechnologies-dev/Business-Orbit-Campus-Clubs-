/**
 * @file mentorProfile.controller.js
 */
const { getMyProfile, updateProfile } = require("./profile.controller");
const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");

// Wrapper for getting profile
exports.getMentorProfile = getMyProfile;

// Wrapper for updating profile
exports.updateMentorProfile = updateProfile;

// Upload profile photo
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const profile = await MentorProfile.findOneAndUpdate(
      { user_id: req.user.id },
      { profile_photo: req.file.path },
      { new: true },
    );
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Photo uploaded", data: profile });
  } catch (error) {
    next(error);
  }
};

// Toggle Mentor Visibility
exports.toggleVisibility = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({
      user_id: req.user.id || req.user._id,
    });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Default is_visible to true if it doesn't exist
    const newVisibility =
      profile.is_visible === undefined ? false : !profile.is_visible;
    profile.is_visible = newVisibility;
    await profile.save();

    res.status(200).json({
      success: true,
      message: `Profile visibility updated to ${newVisibility ? "visible" : "hidden"}.`,
      data: { is_visible: newVisibility },
    });
  } catch (error) {
    next(error);
  }
};
