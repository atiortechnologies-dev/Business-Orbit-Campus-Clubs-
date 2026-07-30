/**
 * @file token.js
 * @description JWT utility wrapper for generating and validating access and refresh tokens.
 * @architecture Exposes highly cohesive functions configured via environment variables, ensuring standard expiration and issuer claims.
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "testrefreshsecret";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

/**
 * @desc    Generate a short-lived JWT access token for a user
 * @param   {Object} user - The user document/object
 * @returns {string} The signed JWT access token
 */
const generateToken = (user) => {
  if (!user._id) {
    throw new Error("User ID is required to generate token");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "bcoc-backend",
    },
  );
};

/**
 * @desc    Generate a long-lived JWT refresh token for a user
 * @param   {Object} user - The user document/object
 * @returns {string} The signed JWT refresh token
 */
const generateRefreshToken = (user) => {
  if (!user._id) {
    throw new Error("User ID is required to generate refresh token");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      type: "refresh",
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "bcoc-backend",
    },
  );
};

/**
 * @desc    Verify and decode an access token
 * @param   {string} token - The access token to verify
 * @returns {Object} The decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "bcoc-backend",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired", { cause: error });
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token", { cause: error });
    }
    throw error;
  }
};

/**
 * @desc    Verify and decode a refresh token
 * @param   {string} token - The refresh token to verify
 * @returns {Object} The decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "bcoc-backend",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired", { cause: error });
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token", { cause: error });
    }
    throw error;
  }
};

/**
 * @desc    Decode a token without verifying its signature
 * @param   {string} token - The token to decode
 * @returns {Object|null} The decoded token payload or null
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
};
