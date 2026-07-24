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

//* Mentor Requests
const requestMentorSchema = z.object({
  problem_statement: z
    .string()
    .trim()
    .min(10, "Problem statement must be at least 10 characters"),
  help_required: z
    .string()
    .trim()
    .min(10, "Help required must be at least 10 characters"),
  preferred_meeting_mode: z
    .enum(["online", "in-person", "any"], {
      error: "Mode must be online, in-person, or any",
    })
    .default("online"),
  preferred_time: z
    .string()
    .trim()
    .min(1, "Preferred time is required"),
  additional_notes: z
    .string()
    .trim()
    .max(1000, "Notes must be under 1000 characters")
    .optional(),
});

const mentorReviewSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  review_text: z.string().trim().max(500, "Review cannot exceed 500 characters").optional()
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
  requestMentorSchema,
  mentorReviewSchema,
};
