const argon2 = require("argon2");

const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
};

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
