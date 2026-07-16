/**
 * Goal: Provides utility functions for generating and verifying JSON Web Tokens (JWT).
 * Architecture relevance: Centralizes the authentication token logic, used by controllers to issue tokens and by middleware to verify requests.
 */
const jwt = require("jsonwebtoken");

/**
 * Generate a JWT for a user
 * @param {Object} payload - Object containing userId, role, and email
 * @returns {string} - The signed JWT
 */
const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "7d",
  });
};

/**
 * Verify and decode a JWT
 * @param {string} token - The JWT string
 * @returns {Object} - The decoded payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
