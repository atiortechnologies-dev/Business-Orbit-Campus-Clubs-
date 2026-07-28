const mongoose = require("mongoose");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const PasswordReset = require("../models/PasswordReset");

const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

const { hashPassword, comparePassword } = require("../utils/password");
const { generateOTP, sendOTPEmail } = require("../utils/email");
const {
  generateToken,
  verifyRefreshToken,
  generateRefreshToken,
} = require("../utils/token");
const roleConfig = require("../utils/roleConfig");
const asyncHandler = require("../middlewares/asyncHandler");
const { checkEmailSchema } = require("../utils/validators");
const { assignChapterToStudent } = require("../utils/chapterAssignment");
const Chapter = require("../models/Chapter");

/**
 * @desc    Get all college name for selection
 * @route   POST /api/auth/get-all-chapter
 * @access  Public
 */
const getAllChapters = asyncHandler(async (req, res) => {
  const chapters = await Chapter.find({ status: "Active" })
    .select("college_name chapter_name")
    .sort({ college_name: 1 });

  if (!chapters || chapters.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No active chapters found" });
  }

  // Group by college name for easy use
  const collegeList = chapters.map((ch) => ({
    collegeName: ch.college_name,
    chapterName: ch.chapter_name,
  }));

  return res.status(200).json({
    success: true,
    data: collegeList,
  });
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const data = req.validatedData;
  const { full_name, email, phone, password, role, ...profileData } = data;

  const config = roleConfig[role];
  if (!config && role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid role configuration" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  if (phone) {
    const phoneTaken = await User.exists({ phone });
    if (phoneTaken) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already registered",
      });
    }
  }

  let chapterId = null;

  if (role === "student") {
    chapterId = await assignChapterToStudent(profileData.college);

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: `No active chapter found for ${profileData.college}. Please contact support.`,
      });
    }
  }

  const password_hash = await hashPassword(password);

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
      await new StudentProfile({
        user_id: user._id,
        chapter_id: chapterId,
        ...profileData,
      }).save({
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
    throw transactionError;
  }

  // const otp = generateOTP();
  // const verification = new EmailVerification({
  //   userId: user._id,
  //   otp,
  //   expiresAt: Date.now() + 15 * 60 * 1000,
  // });
  // await verification.save();

  // try {
  //   await sendOTPEmail(user.email, otp);
  // } catch (error) {
  //   console.error("Failed to send verification email:", error);
  // }

  let redirectUrl =
    user.role === "student"
      ? "/onboarding/welcome"
      : "/onboarding/verify-email";

  // Generate tokens immediately upon registration so onboarding screens (e.g., Welcome Page)
  // can make authenticated requests where req.user.id is accessible via auth middleware.
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        role: user.role,
        account_status: user.account_status,
        email_verified: user.email_verified,
      },
      redirect_to: redirectUrl,
    },
  });
});

/**
 * @desc    Check if email is available
 * @route   GET /api/auth/check-email?email=someone@example.com
 * @access  Public
 */
const checkEmail = asyncHandler(async (req, res) => {
  const result = checkEmailSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
      errors: result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { email } = result.data;
  const exists = await User.exists({ email });

  return res.status(200).json({
    success: true,
    message: exists ? "Email is already in use" : "Email is available",
    data: { available: !exists },
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

  sendOTPEmail(user.email, otp).catch((error) => {
    console.error("Failed to send verification email in background:", error);
  });

  return res.status(200).json({
    success: true,
    message: "If an account exists, an OTP has been sent.",
    otp: otp, // temporary
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
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const redirectTo =
    user.account_status === "active"
      ? `/onboarding/complete-profile/${user.role}`
      : "/onboarding/verification-progress";

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        account_status: user.account_status,
        email_verified: user.email_verified,
        profile_status: user.profile_status,
      },
      redirect_to: redirectTo,
    },
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

  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // 6. Redirect to appropriate dashboard (using roleConfig if available)
  const config = roleConfig[user.role];
  const redirect_to = config.loginRedirect;

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        account_status: user.account_status,
        email_verified: user.email_verified,
        profile_status: user.profile_status,
      },
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
 * @desc    Issue a new access token using a valid refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public (requires a valid refresh token in the body)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Refresh token is required" });
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const newAccessToken = generateToken(user);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken: newAccessToken,
    },
  });
});

/**
 * @desc    Get the currently authenticated user's profile summary
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    data: {
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      account_status: user.account_status,
      email_verified: user.email_verified,
      profile_status: user.profile_status,
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
  refreshAccessToken,
  getMe,
  getAllChapters,
};
