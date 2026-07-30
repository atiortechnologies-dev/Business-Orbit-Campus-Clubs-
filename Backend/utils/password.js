/**
 * @file password.js
 * @description Provides cryptographic utility functions for hashing and comparing passwords.
 * @architecture Uses argon2 for robust password hashing.
 */

const argon2 = require("argon2");

/**
 * @desc    Hash a plain text password using argon2
 * @param   {string} plainPassword - The password to hash
 * @returns {Promise<string>} The resulting hash
 */
const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
};

/**
 * @desc    Compare a plain text password against a stored hash
 * @param   {string} plainPassword - The password to test
 * @param   {string} storedHash - The true hashed password
 * @returns {Promise<boolean>} True if it matches, false otherwise
 */
const comparePassword = async (plainPassword, storedHash) => {
  if (!storedHash) return false;
  try {
    return await argon2.verify(storedHash, plainPassword);
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
};

const verifyPassword = comparePassword;

module.exports = {
  hashPassword,
  comparePassword,
  verifyPassword,
};
