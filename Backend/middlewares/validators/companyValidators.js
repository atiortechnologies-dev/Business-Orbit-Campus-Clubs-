/**
 * @file companyValidators.js
 * @description Zod validation schemas for company opportunity creation and updates.
 */

const { z } = require("zod");

const createOpportunitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  type: z.enum(["Job", "Internship", "Project", "Other"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  required_skills: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
  salary_stipend: z.string().optional(),
  application_deadline: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  status: z.enum(["draft", "open", "closed"]).optional().default("open"),
});

const updateOpportunitySchema = createOpportunitySchema.partial();

module.exports = {
  createOpportunitySchema,
  updateOpportunitySchema,
};
