/**
 * @file asyncHandler.js
 * @description Provides a wrapper for asynchronous route handlers to automatically catch and forward promise rejections to the global error handler.
 * @architecture Eliminates repetitive try/catch blocks across all controllers, adhering strongly to DRY principles.
 */

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
