const argon2 = require("argon2");

const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
  });
};

const verifyPassword = async (plainPassword, storedHash) => {
  if (!storedHash) return false;
  try {
    return await argon2.verify(storedHash, plainPassword);
  } catch (err) {
    return false;
  }
};

module.exports = { hashPassword, verifyPassword };
