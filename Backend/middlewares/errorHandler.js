/**
 * @file errorHandler.js
 * @description Global error handling middleware formatting safe JSON responses.
 * @architecture Prevents sensitive internal error details from leaking to clients in production.
 */

const errorHandler = (err, req, res, _next) => {
  // Always log the full error server-side for debugging
  console.error(err);

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const statusCode =
    err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === "production";

  // Hide raw internal 5xx error messages in production
  let clientMessage = err.message;
  if (statusCode >= 500 && isProduction) {
    clientMessage = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage || "Internal Server Error",
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
