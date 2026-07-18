const crypto = require("crypto");

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += crypto.randomInt(0, 10);
  }
  return otp;
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const verifyOTP = (otp, storedHash) => {
  if (!storedHash) return false;
  return hashOTP(otp) === storedHash;
};

const getOTPExpiry = () => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiry,
  OTP_EXPIRY_MINUTES,
};
