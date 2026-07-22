/**
 * @file validateRequest.js
 * @description Middleware to intercept requests and validate their payload (body, query, params) against a predefined schema.
 * @architecture Keeps controllers clean by ensuring they only ever receive pre-sanitized, structurally sound data.
 */

const validateRequest =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.validatedData = result.data;
    next();
  };

module.exports = { validateRequest };
