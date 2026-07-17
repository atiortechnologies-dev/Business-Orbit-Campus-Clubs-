/**
 * Goal: Provides utility functions for hashing and comparing passwords.
 * Architecture relevance: Centralizes cryptography logic so that models and controllers don't need to implement hashing independently.
 * Switched to argon2 from bcryptjs for better security based on main branch implementation.
 */
const argon2 = require("argon2");

/**
 * Hash a plaintext password
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
};

/**
 * Compare a plaintext password against a hash
 * @param {string} password - The plaintext password
 * @param {string} hashedPassword - The hashed password stored in DB
 * @returns {Promise<boolean>} - True if they match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  if (!hashedPassword) return false;
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (err) {
    return false;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
