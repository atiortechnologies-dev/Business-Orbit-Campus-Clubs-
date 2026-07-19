const { z } = require("zod");

const currentYear = new Date().getFullYear();

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
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional(),
  password: passwordSchema,
  confirm_password: z.string(),
});

// Role Specific fields
const studentFields = z.object({
  role: z.literal("student"),
  college: z.string().trim().min(2, "College name is required"),
  degree: z.string().trim().min(2, "Degree is required"),
  graduation_year: z.coerce
    .number()
    .int()
    .min(currentYear - 6, "Invalid graduation year")
    .max(currentYear + 6, "Invalid graduation year"),
});

const mentorFields = z.object({
  role: z.literal("mentor"),
  organization: z.string().trim().min(2, "Organization is required"),
  designation: z.string().trim().min(2, "Designation is required"),
  expertise: z.string().trim().min(2, "Expertise / domain is required"),
  years_of_experience: z.coerce
    .number()
    .min(0)
    .max(60, "Invalid years of experience"),
});

const investorFields = z.object({
  role: z.literal("investor"),
  organization: z
    .string()
    .trim()
    .min(4, "Organization / fund name is required"),
  investment_focus: z.string().trim().min(2, "Investment focus is required"),
  investment_stage: z.string().trim().min(2, "Investment stage is required"),
  profile_url: urlOptional,
});

const incubatorFields = z.object({
  role: z.literal("incubator"),
  incubator_name: z.string().trim().min(4, "Incubator name is required"),
  organization: z.string().trim().min(4, "Organization is required"),
  city: z.string().trim().min(4, "City/location is required"),
  website: urlOptional,
});

const companyFields = z.object({
  role: z.literal("company"),
  company_name: z.string().trim().min(2, "Company name is required"),
  industry: z.string().trim().min(2, "Industry is required"),
  company_size: z.string().trim().min(1, "Company size is required"),
  website: z.string().trim().url("Invalid URL format"),
  contact_person: z.string().trim().min(2, "Contact person is required"),
});

const roleSpecificUnion = z.discriminatedUnion("role", [
  studentFields,
  mentorFields,
  investorFields,
  incubatorFields,
  companyFields,
]);

// Full registration = common fields + role specific field
const registerSchema = baseFields
  .and(roleSpecificUnion)
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const checkEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
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
      } catch (error) {}
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

module.exports = {
  registerSchema,
  checkEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  commonProfileFields,
  roleSpecificCompleteSchemas,
};
