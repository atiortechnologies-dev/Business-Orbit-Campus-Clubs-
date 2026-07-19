const User = require("../model/User");
const roleConfig = require("../utils/roleConfig");
const asyncHandler = require("../middlewares/asyncHandler");
const { hashPassword } = require("../utils/password");
const { checkEmailSchema } = require("../utils/validators");
const {
  generateOTP,
  hashOTP,
  getOTPExpiry,
  verifyOTP,
  OTP_EXPIRY_MINUTES,
} = require("../utils/otp");
const { sendOTPEmail } = require("../utils/sendEmails");

//* POST: /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const data = req.validatedData;
  const { full_name, email, phone, password, role } = data;

  const config = roleConfig[role];
  if (!config) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  const emailTaken = await User.exists({ email });
  if (emailTaken) {
    return res
      .status(409)
      .json({ success: false, message: "Email is already registered" });
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

  const password_hash = await hashPassword(password);

  // generate otp
  const otp = generateOTP();
  const otp_code_hash = hashOTP(otp);
  const otp_expires_at = getOTPExpiry();

  let user;
  try {
    user = await User.create({
      full_name,
      email,
      phone,
      password_hash,
      role,
      account_status: config.initialStatus,
      email_verified: false,
      otp_code_hash,
      otp_expires_at,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      return res
        .status(409)
        .json({ success: false, message: `${field} already exists` });
    }
    throw err;
  }

  try {
    const profileData = { user_id: user._id };
    for (const field of config.profileFields) {
      profileData[field] = data[field];
    }
    await config.ProfileModel.create(profileData);
  } catch (err) {
    if (user && user._id) {
      await User.findByIdAndDelete(user._id);
    }
    throw err;
  }

  // send otp mail
  try {
    await sendOTPEmail(email, otp);
  } catch (error) {
    console.error("Failed to send verification email:", err.message);
  }

  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      user_id: user._id,
      role: user.role,
      account_status: user.account_status,
      email_verified: user.email_verified,
      otp: otp,
      redirect_to: config.redirectTo,
    },
  });
});

//* GET /api/auth/check-email?email=someone@example.com
const checkEmailAvailability = asyncHandler(async (req, res) => {
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

//* POST: /api/auth/send-otp
const sendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;

  const user = await User.findOne({ email }).select(
    "+otp_code_hash +otp_expires_at",
  );
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "No account found for this email" });
  }

  if (user.email_verified) {
    return res
      .status(400)
      .json({ success: false, message: "Email is already verified" });
  }

  const otp = generateOTP();
  user.otp_code_hash = hashOTP(otp);
  user.otp_expires_at = getOTPExpiry();
  await user.save();

  try {
    await sendOTPEmail(email, otp);
  } catch (error) {
    console.error("Failed to send verification email:", err.message);
    return res.status(502).json({
      success: false,
      message: "Could not send OTP email. Please try again.",
    });
  }

  return res.status(200).json({
    success: true,
    message: `OTP sent to ${email}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
  });
});

const verifyOTPfxn = asyncHandler(async (req, res) => {
  const { email, otp } = req.validatedData;

  const user = await User.findOne({ email }).select(
    "+otp_code_hash +otp_expires_at",
  );
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "No account found for this email" });
  }

  if (user.email_verified) {
    return res
      .status(400)
      .json({ success: false, message: "Email is already verified" });
  }

  if (!user.otp_expires_at || user.otp_expires_at < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (!verifyOTP(otp, user.otp_code_hash)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  user.email_verified = true;
  user.otp_code_hash = undefined;
  user.otp_expires_at = undefined;
  user.account_status = user.role === "student" ? "active" : "pending_approval";

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: { account_status: user.account_status },
  });
});

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
  registerUser,
  checkEmailAvailability,
  sendVerificationOtp,
  verifyOTPfxn,
  getMe,
};
