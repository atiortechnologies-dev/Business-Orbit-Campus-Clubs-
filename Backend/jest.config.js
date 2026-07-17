module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "utils/**/*.js",
    "middlewares/**/*.js"
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000
};
