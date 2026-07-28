/**
 * @file cors.js
 * @description Defines the Cross-Origin Resource Sharing (CORS) options and allowed origins for the application.
 * @architecture Provides a centralized configuration layer for security and access control, keeping the main server.js file clean.
 */

const cors = require("cors");

const configureCors = () => {
  const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL]
    .filter(Boolean)
    .map((origin) => origin.trim());

  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
};

module.exports = configureCors;
