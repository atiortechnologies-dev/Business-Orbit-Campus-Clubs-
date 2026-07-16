/**
 * Goal: Provides express middleware for validating incoming request payloads.
 * Architecture relevance: Uses express-validator to define and enforce validation rules before the request reaches the controller, ensuring data integrity and security.
 */
const { body, validationResult } = require("express-validator");

/**
 * Handle validation errors
 * Middleware to catch and format express-validator errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return structured 400 JSON response
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for Register
 */
const validateRegister = [
  body("full_name").trim().notEmpty().withMessage("Full name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["student", "mentor", "investor", "incubator", "company"])
    .withMessage("Invalid role"),

  // Conditional Role Validations
  body("college")
    .if(body("role").equals("student"))
    .notEmpty()
    .withMessage("College is required"),
  body("degree")
    .if(body("role").equals("student"))
    .notEmpty()
    .withMessage("Degree is required"),
  body("graduation_year")
    .if(body("role").equals("student"))
    .isInt()
    .withMessage("Valid graduation year is required"),

  body("organization")
    .if(body("role").isIn(["mentor", "investor", "incubator"]))
    .notEmpty()
    .withMessage("Organization is required"),
  body("designation")
    .if(body("role").equals("mentor"))
    .notEmpty()
    .withMessage("Designation is required"),
  body("expertise")
    .if(body("role").equals("mentor"))
    .notEmpty()
    .withMessage("Expertise is required"),
  body("years_of_experience")
    .if(body("role").equals("mentor"))
    .isInt()
    .withMessage("Valid years of experience is required"),

  body("investment_focus")
    .if(body("role").equals("investor"))
    .notEmpty()
    .withMessage("Investment focus is required"),
  body("investment_stage")
    .if(body("role").equals("investor"))
    .notEmpty()
    .withMessage("Investment stage is required"),
  body("profile_url")
    .if(body("role").equals("investor"))
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),

  body("incubator_name")
    .if(body("role").equals("incubator"))
    .notEmpty()
    .withMessage("Incubator name is required"),
  body("city")
    .if(body("role").equals("incubator"))
    .notEmpty()
    .withMessage("City is required"),

  body("company_name")
    .if(body("role").equals("company"))
    .notEmpty()
    .withMessage("Company name is required"),
  body("industry")
    .if(body("role").equals("company"))
    .notEmpty()
    .withMessage("Industry is required"),
  body("company_size")
    .if(body("role").equals("company"))
    .notEmpty()
    .withMessage("Company size is required"),
  body("contact_person")
    .if(body("role").equals("company"))
    .notEmpty()
    .withMessage("Contact person is required"),
  body("website")
    .if(body("role").equals("incubator"))
    .optional()
    .isURL()
    .withMessage("Invalid URL format"),
  body("website")
    .if(body("role").equals("company"))
    .notEmpty()
    .withMessage("Company website is required")
    .isURL()
    .withMessage("Invalid URL format"),

  handleValidationErrors,
];

/**
 * Validation rules for Check Email
 */
const { query } = require("express-validator");
const validateCheckEmail = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  handleValidationErrors,
];

/**
 * Validation rules for Send OTP
 */
const validateSendOtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateCheckEmail,
  validateSendOtp,
};
