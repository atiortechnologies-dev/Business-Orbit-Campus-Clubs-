const User = require("../model/User");
const roleConfig = require("../utils/roleConfig");
const asyncHandler = require("../middlewares/asyncHandler");
const { hashPassword } = require("../utils/password");
const { checkEmailSchema } = require("../utils/validators");

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

  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      user_id: user._id,
      role: user.role,
      account_status: user.account_status,
      email_verified: user.email_verified,
      redirect_to: config.redirectTo,
    },
  });
});

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

module.exports = { registerUser, checkEmailAvailability };
