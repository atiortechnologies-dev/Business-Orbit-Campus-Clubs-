const cors = require("cors");

const configureCors = () => {
  const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL]
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
