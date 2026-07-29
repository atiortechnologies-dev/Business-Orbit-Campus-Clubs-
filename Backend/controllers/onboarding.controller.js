/**
 * @file onboarding.controller.js
 * @description Controls the dynamic onboarding flow for new users.
 * @architecture Uses a state-machine-like logic to evaluate user statuses and dictate the next frontend screen.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const roleConfig = require("../utils/roleConfig");

/**
 * Works out which screen or route the frontend should show next:
 *   Signup -> Email Verification -> Verification Pending -> Approved/Rejected -> Complete Profile -> Dashboard
 */
const resolveNextScreen = (user) => {
  // 1. Unverified Email
  if (!user.email_verified) {
    return "email_verification";
  }

  // 2. Verification Pending States
  if (
    user.account_status === "pending_verification" ||
    user.account_status === "pending_approval"
  ) {
    return "verification_pending";
  }

  // 3. Rejected or Suspended States
  if (user.account_status === "rejected") {
    return "profile_rejected";
  }

  if (user.account_status === "suspended") {
    return "account_suspended";
  }

  // 4. Account is active -> Check Profile Completion
  // Handles both 'pending' and 'not_started' default values
  if (
    user.profile_status === "pending" ||
    user.profile_status === "not_started"
  ) {
    return "complete_profile";
  }

  // 5. Profile Completed or Skipped -> Send to Dashboard
  const config = roleConfig[user.role];
  return config ? config.dashboardRedirect : "/dashboard";
};

/**
 * @desc    Get the current onboarding status and next screen for the user
 * @route   GET /api/onboarding/status
 * @access  Private
 */
const getOnboardingStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "email_verified account_status profile_status role",
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const nextScreen = resolveNextScreen(user);

  return res.status(200).json({
    success: true,
    data: {
      email_verified: user.email_verified,
      account_status: user.account_status,
      profile_completion_status: user.profile_status,
      role: user.role,
      next_screen: nextScreen,
      // Helper field for frontend router
      redirect_to:
        nextScreen === "complete_profile"
          ? `/onboarding/complete-profile/${user.role}`
          : nextScreen === "verification_pending"
            ? "/onboarding/verification-progress"
            : nextScreen === "email_verification"
              ? "/onboarding/verify-email"
              : nextScreen,
    },
  });
});

module.exports = { getOnboardingStatus, resolveNextScreen };
