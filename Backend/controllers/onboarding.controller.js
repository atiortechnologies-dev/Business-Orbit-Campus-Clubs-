/**
 * @file onboarding.controller.js
 * @description Controls the dynamic onboarding flow for new users.
 * @architecture Uses a state-machine-like logic to evaluate user statuses and dictate the next frontend screen.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const roleConfig = require("../utils/roleConfig");

/**
 * Works out which screen the frontend should show next, following the
 * "Navigation Logic" flow described in the API spec:
 *
 *   Signup -> (Select College, student only) -> Email Verification
 *          -> Verification Pending -> Approved / Rejected
 *          -> Role Account Profile -> Role Dashboard
 */
const resolveNextScreen = (user) => {
  if (!user.email_verified) {
    return "email_verification";
  }

  if (user.account_status === "pending_verification") {
    return "verification_pending";
  }

  if (user.account_status === "pending_approval") {
    return "verification_pending";
  }

  if (user.account_status === "rejected") {
    return "profile_rejected";
  }

  if (user.account_status === "suspended") {
    return "account_suspended";
  }

  // account_status === "active" from here on
  if (user.profile_status === "not_started") {
    return "complete_profile";
  }

  const config = roleConfig[user.role];
  return config ? config.dashboardRedirect : "dashboard";
};

/**
 * @desc    Get the current onboarding status and next screen for the user
 * @route   GET /api/onboarding/status
 * @access  Private
 */
const getOnboardingStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    data: {
      email_verified: user.email_verified,
      account_status: user.account_status,
      profile_completion_status: user.profile_status,
      role: user.role,
      next_screen: resolveNextScreen(user),
    },
  });
});

module.exports = { getOnboardingStatus };
