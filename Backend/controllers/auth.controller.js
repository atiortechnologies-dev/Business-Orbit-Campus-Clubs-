/**
 * Goal: Handles the business logic for user authentication.
 * Architecture relevance: Receives requests from auth routes, processes data (login, registration,
 * role-based profile creation, email verification), and interacts with the models and utility services.
 */
const mongoose = require("mongoose");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const { hashPassword } = require("../utils/hash");
const { generateOTP, sendOTPEmail } = require("../utils/email");

// Import Role Models
const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { full_name, email, phone, password, role, ...profileData } =
      req.body;

    // 1. Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // 2. Check if phone exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res
          .status(400)
          .json({ success: false, message: "Phone number already exists" });
      }
    }

    // 3. Hash password
    const password_hash = await hashPassword(password);

    // 4. Create User & Profile atomically with Mongoose Transactions
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
        account_status: "Pending Verification",
        email_verified: false,
      });

      await user.save({ session });

      // 5. Create Role-Specific Profile
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

    // 6. Generate and send verification OTP
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
      // We don't fail the registration if email fails, but they'll need to resend it
    }

    // 7. Respond with role-based instructions
    const redirectTo =
      role === "student" ? "/welcome-chapter" : "/email-verification";

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        userId: user._id,
        role: user.role,
        redirect_to: redirectTo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if email is available
 * @route   GET /api/auth/check-email
 * @access  Public
 */
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email query parameter is required" });
    }

    const user = await User.findOne({ email });
    return res.status(200).json({
      success: true,
      available: !user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend verification OTP
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak user existence
      return res
        .status(200)
        .json({
          success: true,
          message: "If an account exists, an OTP has been sent.",
        });
    }

    if (user.email_verified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified." });
    }

    // Invalidate any previous OTPs to prevent multiple valid OTPs
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

    return res
      .status(200)
      .json({
        success: true,
        message: "If an account exists, an OTP has been sent.",
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  checkEmail,
  sendOtp,
};
