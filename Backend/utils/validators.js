/**
 * @file validators.js
 * @description Provides common validation schemas and helper functions (e.g., using Joi or Zod) for standard user inputs.
 * @architecture Extracts request validation rules out of controllers and routes, promoting reusability and cleaner request handlers.
 */

const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

const urlOptional = z
  .string()
  .trim()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(""));

// Common field to every role
const baseFields = z.object({
  full_name: z
    .string()
    .trim()
    .min(4, "Full name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  phone: z.string().trim().optional(), // added since main contained it but there is no frontend implementation for it
  password: passwordSchema,
  confirm_password: z.string(),
});

const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

const registerStudentSchema = baseFields.extend({
  role: z.literal("student"),
  college: z.string().trim().min(1, "College is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  graduation_year: z.coerce.number().int().min(1900),
});

const registerMentorSchema = baseFields.extend({
  role: z.literal("mentor"),
  organization: z.string().trim().min(1, "Organization is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  expertise: z.string().trim().min(1, "Expertise is required"),
  years_of_experience: z.coerce.number().min(0),
});

const registerInvestorSchema = baseFields.extend({
  role: z.literal("investor"),
  organization: z.string().trim().min(1, "Organization is required"),
  investment_focus: z.string().trim().min(1, "Investment focus is required"),
  investment_stage: z.string().trim().min(1, "Investment stage is required"),
  profile_url: urlOptional,
});

const registerIncubatorSchema = baseFields.extend({
  role: z.literal("incubator"),
  incubator_name: z.string().trim().min(1, "Incubator name is required"),
  organization: z.string().trim().min(1, "Organization is required"),
  city: z.string().trim().min(1, "City is required"),
  website: urlOptional,
});

const registerCompanySchema = baseFields.extend({
  role: z.literal("company"),
  company_name: z.string().trim().min(1, "Company name is required"),
  industry: z.string().trim().min(1, "Industry is required"),
  company_size: z.string().trim().min(1, "Company size is required"),
  contact_person: z.string().trim().min(1, "Contact person is required"),
  website: z.string().url("Invalid URL format").trim(),
});

// Full registration = common fields + role specific field
const registerSchema = z
  .discriminatedUnion("role", [
    registerStudentSchema,
    registerMentorSchema,
    registerInvestorSchema,
    registerIncubatorSchema,
    registerCompanySchema,
  ])
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const checkEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

const resetPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    reset_token: z.string().trim().min(6, "Reset token is required"),
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const contactEnquirySchema = z.object({
  companyName: z.string().min(2, "Company Name is required"),
  contactPerson: z.string().min(2, "Contact Person is required"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  phone: z.string().trim().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  otp: z.string().trim().min(6, "OTP must be 6 characters").max(6),
});

module.exports = {
  registerSchema,
  checkEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  contactEnquirySchema,
};
