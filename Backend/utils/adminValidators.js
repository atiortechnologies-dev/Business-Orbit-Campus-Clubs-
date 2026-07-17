/**
 * @file adminValidators.js
 * @description Provides validation schemas specific to administrative actions and content management payloads.
 * @architecture Separates complex administrative validation logic from standard user validators to maintain modularity.
 */

const { z } = require('zod');

// FAQ Schemas
const createFaqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  pageType: z.enum(['Main Landing', 'Student', 'Mentor', 'Investor', 'Incubator', 'Company'])
});
const updateFaqSchema = createFaqSchema.partial();

// Statistic Schemas
const createStatisticSchema = z.object({
  title: z.string().min(2, "Title is required"),
  value: z.string().min(1, "Value is required"),
  landingPage: z.enum(['Main Landing', 'Student', 'Mentor', 'Investor', 'Company'])
});
const updateStatisticSchema = createStatisticSchema.partial();

// PartnerLogo Schemas
const createPartnerLogoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logoUrl: z.string().url("Must be a valid URL"),
  category: z.enum(['College', 'Technology Partner', 'Incubator', 'Startup Partner', 'Business Partner'])
});
const updatePartnerLogoSchema = createPartnerLogoSchema.partial();

// SuccessStory Schemas
const createSuccessStorySchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  name: z.string().min(2, "Name is required"),
  organization: z.string().min(2, "Organization is required"),
  image: z.string().url("Must be a valid URL").optional(),
  storyType: z.enum(['Founder', 'Mentor', 'Investor', 'Incubator', 'Company']),
  featured: z.boolean().optional()
});
const updateSuccessStorySchema = createSuccessStorySchema.partial();

// FeaturedStartup Schemas
const createFeaturedStartupSchema = z.object({
  startupName: z.string().min(2, "Startup Name is required"),
  founder: z.string().min(2, "Founder is required"),
  stage: z.string().optional(),
  industry: z.string().optional(),
  fundingStatus: z.string().optional(),
  shortDescription: z.string().optional(),
  featured: z.boolean().optional()
});
const updateFeaturedStartupSchema = createFeaturedStartupSchema.partial();

module.exports = {
  createFaqSchema, updateFaqSchema,
  createStatisticSchema, updateStatisticSchema,
  createPartnerLogoSchema, updatePartnerLogoSchema,
  createSuccessStorySchema, updateSuccessStorySchema,
  createFeaturedStartupSchema, updateFeaturedStartupSchema
};
