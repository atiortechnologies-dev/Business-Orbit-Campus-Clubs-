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
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

//* Onboarding schema

const toArray = z.preprocess(
  (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch (error) {
        console.error(error);
      }
      return trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return val;
  },
  z.array(z.string().trim().min(1)),
);

const commonProfileFields = z.object({
  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must be under 1000 characters"),
  skills: toArray.refine(
    (arr) => arr.length > 0,
    "At least one skill/interest is required",
  ),
  linkedin_url: z
    .string()
    .trim()
    .url("Invalid LinkedIn URL")
    .refine(
      (url) => url.includes("linkedin.com"),
      "Must be a linkedin.com URL",
    ),
  portfolio_url: urlOptional,
  profile_photo: z.string().trim().optional().or(z.literal("")),
});

const studentCompleteFields = z.object({
  startup_interests: toArray,
  areas_of_interest: toArray,
});

const mentorCompleteFields = z.object({
  mentoring_domains: toArray,
  preferred_startup_stages: toArray,
  availability: z.string().trim().optional().or(z.literal("")),
});

const investorCompleteFields = z.object({
  investor_type: z.enum(["Angel", "VC", "Corporate"], {
    error: "Investor type must be Angel, VC, or Corporate",
  }),
  investment_sectors: toArray,
  preferred_startup_stages: toArray,
  investment_range: z.string().trim().optional().or(z.literal("")),
});

const incubatorCompleteFields = z.object({
  organization_type: z.string().trim().min(2, "Organization type is required"),
  supported_startup_domains: toArray,
  services_offered: toArray,
  contact_person: z.string().trim().min(2, "Contact person is required"),
});

const companyCompleteFields = z.object({
  hiring_domains: toArray,
});

const roleSpecificCompleteSchemas = {
  student: studentCompleteFields,
  mentor: mentorCompleteFields,
  investor: investorCompleteFields,
  incubator: incubatorCompleteFields,
  company: companyCompleteFields,
};

//* Startup Submission:
const submitIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be under 150 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must be under 5000 characters"),
});

const saveDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .max(150, "Title must be under 150 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be under 5000 characters")
    .optional(),
});

// Survey validators
const createSurveySchema = z.object({
  survey_title: z
    .string()
    .min(1, "Survey title is required")
    .max(200, "Survey title must be less than 200 characters"),
  responses_count: z
    .number()
    .min(0, "Responses count cannot be negative")
    .optional()
    .default(0),
  interviews_count: z
    .number()
    .min(0, "Interviews count cannot be negative")
    .optional()
    .default(0),
  findings: z
    .string()
    .max(5000, "Findings must be less than 5000 characters")
    .optional()
    .default(""),
});

const updateSurveySchema = z.object({
  survey_title: z
    .string()
    .min(1, "Survey title is required")
    .max(200, "Survey title must be less than 200 characters")
    .optional(),
  responses_count: z
    .number()
    .min(0, "Responses count cannot be negative")
    .optional(),
  interviews_count: z
    .number()
    .min(0, "Interviews count cannot be negative")
    .optional(),
  findings: z
    .string()
    .max(5000, "Findings must be less than 5000 characters")
    .optional(),
  status: z.enum(["draft", "completed"]).optional(),
});

const uploadEvidenceSchema = z.object({
  file_name: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name is too long"),
  file_type: z
    .enum([
      "survey_results",
      "interview_notes",
      "photo",
      "video",
      "research_document",
      "pdf",
      "spreadsheet",
      "other",
    ])
    .optional()
    .default("other"),
  file_size: z
    .number()
    .min(1, "File size must be greater than 0")
    .max(50 * 1024 * 1024, "File size cannot exceed 50MB"),
});

// Validation report validators
const submitValidationReportSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(5000, "Summary must be less than 5000 characters"),
  key_findings: z
    .string()
    .max(3000, "Key findings must be less than 3000 characters")
    .optional()
    .default(""),
  problem_validated: z.boolean().optional().default(false),
  market_size_estimate: z
    .string()
    .max(200, "Market size estimate must be less than 200 characters")
    .optional()
    .default(""),
  next_steps: z
    .string()
    .max(1000, "Next steps must be less than 1000 characters")
    .optional()
    .default(""),
});

const updateValidationReportSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(5000, "Summary must be less than 5000 characters")
    .optional(),
  key_findings: z
    .string()
    .max(3000, "Key findings must be less than 3000 characters")
    .optional(),
  problem_validated: z.boolean().optional(),
  market_size_estimate: z
    .string()
    .max(200, "Market size estimate must be less than 200 characters")
    .optional(),
  next_steps: z
    .string()
    .max(1000, "Next steps must be less than 1000 characters")
    .optional(),
});

// Meeting reschedule validator (for student)
const requestMeetingRescheduleSchema = z.object({
  reschedule_reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must be less than 500 characters")
    .optional()
    .default(""),
});

// update profile schema
const updateProfileSchema = z.object({
  full_name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  skills: z.array(z.string()).optional(),
  college: z.string().max(150, "College name too long").optional(),
  degree: z.string().max(100, "Degree name too long").optional(),
  graduation_year: z
    .number()
    .min(2000, "Graduation year must be 2000 or later")
    .max(2050, "Graduation year must be before 2050")
    .optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().default(""),
  portfolio_url: z.string().url("Invalid portfolio URL").optional().default(""),
});

const updateStartupSchema = z.object({
  startup_name: z
    .string()
    .min(1, "Startup name required")
    .max(150, "Startup name too long"),
  tagline: z.string().max(200, "Tagline too long").optional().default(""),
  industry: z.string().max(100, "Industry too long").optional().default(""),
  problem_statement: z
    .string()
    .max(2000, "Problem statement too long")
    .optional()
    .default(""),
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
  refreshTokenSchema,
  commonProfileFields,
  roleSpecificCompleteSchemas,
  submitIdeaSchema,
  saveDraftSchema,
  createSurveySchema,
  updateSurveySchema,
  uploadEvidenceSchema,
  submitValidationReportSchema,
  updateValidationReportSchema,
  requestMeetingRescheduleSchema,
  updateProfileSchema,
  updateStartupSchema,
};
