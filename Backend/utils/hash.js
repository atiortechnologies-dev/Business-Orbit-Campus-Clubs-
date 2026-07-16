/**
 * Goal: Provides utility functions for hashing and comparing passwords.
 * Architecture relevance: Centralizes cryptography logic so that models and controllers don't need to implement hashing independently.
 */
const bcrypt = require("bcryptjs");

/**
 * Hash a plaintext password
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password against a hash
 * @param {string} password - The plaintext password
 * @param {string} hashedPassword - The hashed password stored in DB
 * @returns {Promise<boolean>} - True if they match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
