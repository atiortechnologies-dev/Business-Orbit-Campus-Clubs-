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

module.exports = { registerSchema, checkEmailSchema };
