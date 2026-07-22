/**
 * @file auth.controller.js
 * @description Handles business logic for user authentication, including registration, login, and password recovery.
 * @architecture Acts as the intermediary between authentication routes and user/token models, keeping the routing layer stateless.
 */

/**
 * Goal: Handles the business logic for user authentication.
 * Architecture relevance: Receives requests from auth routes, processes data (login, registration,
 * role-based profile creation, email verification), and interacts with the models and utility services.
 */
const mongoose = require("mongoose");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const PasswordReset = require("../models/PasswordReset");

// Import Role Models
const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

const { hashPassword, comparePassword } = require("../utils/password");
const { generateOTP, sendOTPEmail } = require("../utils/email");
const { generateToken } = require("../utils/token");
const roleConfig = require("../utils/roleConfig");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  // Use req.validatedData provided by Zod middleware
  const data = req.validatedData;
  const { full_name, email, phone, password, role, ...profileData } = data;

  const config = roleConfig[role];
  if (!config && role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid role configuration" });
  }

  // 1. Check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  // 2. Hash password (using Argon2 via hash.js)
  const password_hash = await hashPassword(password);

  // 3. Create User Document and Profile atomically
  const session = await mongoose.startSession();
  session.startTransaction();

  let user;
  try {
    user = new User({
      full_name,
      email,
      phone,
      password_hash,
      role,
      account_status: config ? config.initialStatus : "pending_verification",
      email_verified: false,
    });

    await user.save({ session });

    // 4. Create Role-Specific Profile
    if (role === "student") {
      await new StudentProfile({ user_id: user._id, ...profileData }).save({
        session,
      });
    } else if (role === "mentor") {
      await new MentorProfile({ user_id: user._id, ...profileData }).save({
        session,
      });
    } else if (role === "investor") {
      await new InvestorProfile({ user_id: user._id, ...profileData }).save({
        session,
      });
    } else if (role === "incubator") {
      await new IncubatorProfile({ user_id: user._id, ...profileData }).save({
        session,
      });
    } else if (role === "company") {
      await new CompanyProfile({ user_id: user._id, ...profileData }).save({
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (transactionError) {
    await session.abortTransaction();
    session.endSession();
    throw transactionError; // Will be caught by outer try-catch and forwarded to next(error)
  }

  // 5. Generate and send verification OTP
  const otp = generateOTP();
  const verification = new EmailVerification({
    userId: user._id,
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  await verification.save();

  try {
    await sendOTPEmail(user.email, otp);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  // 6. Respond with instructions
  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      userId: user._id,
      role: user.role,
      redirect_to: config ? config.redirectTo : "/email-verification",
    },
  });
});

/**
 * @desc    Check if email is available
 * @route   GET /api/auth/check-email
 * @access  Public
 */
const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;
  const user = await User.findOne({ email });
  return res.status(200).json({
    success: true,
    available: !user,
    message: user ? "Email is already in use" : "Email is available",
  });
});

/**
 * @desc    Resend verification OTP
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account exists, an OTP has been sent.",
    });
  }

  if (user.email_verified) {
    return res
      .status(400)
      .json({ success: false, message: "Email is already verified." });
  }

  await EmailVerification.deleteMany({ userId: user._id });

  const otp = generateOTP();
  const verification = new EmailVerification({
    userId: user._id,
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  await verification.save();

  try {
    await sendOTPEmail(user.email, otp);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return res.status(200).json({
    success: true,
    message: "If an account exists, an OTP has been sent.",
  });
});

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  // 1. Verify email exists and get password_hash
  const user = await User.findOne({ email }).select("+password_hash");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // 2. Verify password
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // 3. Check email verification status
  if (!user.email_verified) {
    return res
      .status(403)
      .json({ success: false, message: "Please verify your email" });
  }

  // 4. Check account status
  if (user.account_status === "pending_verification") {
    return res
      .status(403)
      .json({ success: false, message: "Account pending verification" });
  }
  if (user.account_status === "rejected") {
    return res
      .status(403)
      .json({ success: false, message: "Account has been rejected" });
  }

  // 5. Generate authentication token
  const token = generateToken({
    userId: user._id,
    role: user.role,
    email: user.email,
  });

  // 6. Redirect to appropriate dashboard (using roleConfig if available)
  const config = roleConfig[user.role];
  const redirect_to = config ? config.redirectTo : `/${user.role}-dashboard`;

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    data: {
      userId: user._id,
      role: user.role,
      token,
      redirect_to,
    },
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    // Avoid revealing account existence
    return res.status(200).json({
      success: true,
      message:
        "If an account exists, password reset instructions have been sent.",
    });
  }

  // Invalidate any previous unused reset tokens
  await PasswordReset.updateMany(
    { user_id: user._id, used: false },
    { $set: { used: true } },
  );

  // Generate secure reset token (OTP)
  const otp = generateOTP();

  const resetToken = new PasswordReset({
    user_id: user._id,
    reset_token: otp,
    expires_at: Date.now() + 15 * 60 * 1000, // 15 minutes expiry
  });
  await resetToken.save();

  // Send reset email
  try {
    await sendOTPEmail(user.email, otp, {
      subject: "BOCC - Password Reset",
      headerText: "Reset Your Password",
      descriptionText:
        "You requested a password reset. Please use the following OTP to reset your password.",
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }

  return res.status(200).json({
    success: true,
    message:
      "If an account exists, password reset instructions have been sent.",
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, reset_token, new_password } = req.validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token or email" });
  }

  // 1. Verify reset token
  const passwordReset = await PasswordReset.findOne({
    user_id: user._id,
    reset_token,
    used: false,
    expires_at: { $gt: Date.now() },
  });

  if (!passwordReset) {
    return res
      .status(400)
      .json({ success: false, message: "Token is invalid or has expired" });
  }

  // 2. Hash new password
  const password_hash = await hashPassword(new_password);

  // 3. Update password in user model
  user.password_hash = password_hash;
  await user.save();

  // 4. Invalidate reset token
  passwordReset.used = true;
  await passwordReset.save();

  return res.status(200).json({
    success: true,
    message: "Password has been successfully reset",
  });
});

/**
 * @desc    Verify OTP and transition account status
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or OTP" });
  }

  if (user.email_verified) {
    return res
      .status(400)
      .json({ success: false, message: "Email is already verified" });
  }

  // Find valid OTP
  const verification = await EmailVerification.findOne({
    userId: user._id,
    otp,
    expiresAt: { $gt: Date.now() },
  });

  if (!verification) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  // Update user verification and status
  user.email_verified = true;
  user.account_status = user.role === "student" ? "active" : "pending_approval";

  await user.save();

  // Cleanup OTPs
  await EmailVerification.deleteMany({ userId: user._id });

  // Generate authentication token
  const token = generateToken({
    userId: user._id,
    role: user.role,
    email: user.email,
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      userId: user._id,
      role: user.role,
      token,
      redirect_to: `/${user.role}-dashboard`,
    },
  });
});

module.exports = {
  register,
  checkEmail,
  sendOtp,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
