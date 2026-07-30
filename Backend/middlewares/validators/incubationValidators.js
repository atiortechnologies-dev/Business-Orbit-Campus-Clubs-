/**
 * @file incubationValidators.js
 * @description Zod validation schemas for Student Incubation endpoints.
 * @architecture Enforces payload correctness and required fields before reaching controllers.
 */

const { z } = require("zod");

const filterIncubatorsSchema = z.object({
  search: z.string().optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  location: z.string().optional(),
  sort: z.enum(["deadline", "latest"]).optional(),
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
});

const applyIncubationSchema = z.object({
  incubator_id: z.string().min(1, "Incubator ID is required"),
  startup_info: z.object({
    startup_name: z.string().min(1, "Startup name is required"),
    startup_stage: z.string().min(1, "Startup stage is required"),
    industry: z.string().min(1, "Industry is required"),
    problem_statement: z.string().min(1, "Problem statement is required"),
    solution_summary: z.string().min(1, "Solution summary is required"),
  }),
  business_details: z
    .object({
      business_model: z.string().optional(),
      target_market: z.string().optional(),
      revenue_model: z.string().optional(),
    })
    .optional(),
  team_info: z
    .array(
      z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .optional(),
  supporting_documents: z.object({
    pitch_deck: z.string().url("Pitch deck must be a valid URL"),
    business_plan: z.string().optional(),
    mvp_link: z
      .string()
      .url("MVP link must be a valid URL")
      .optional()
      .or(z.literal("")),
    demo_video: z.string().optional(),
    additional_docs: z.array(z.string()).optional(),
  }),
  declaration_accepted: z.literal(true, {
    errorMap: () => ({ message: "Declaration must be accepted" }),
  }),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "Terms and conditions must be accepted" }),
  }),
});

const updateApplicationSchema = z.object({
  startup_info: z
    .object({
      startup_name: z.string().optional(),
      startup_stage: z.string().optional(),
      industry: z.string().optional(),
      problem_statement: z.string().optional(),
      solution_summary: z.string().optional(),
    })
    .optional(),
  business_details: z
    .object({
      business_model: z.string().optional(),
      target_market: z.string().optional(),
      revenue_model: z.string().optional(),
    })
    .optional(),
  team_info: z
    .array(
      z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .optional(),
  supporting_documents: z
    .object({
      pitch_deck: z.string().url("Pitch deck must be a valid URL").optional(),
      business_plan: z.string().optional(),
      mvp_link: z
        .string()
        .url("MVP link must be a valid URL")
        .optional()
        .or(z.literal("")),
      demo_video: z.string().optional(),
      additional_docs: z.array(z.string()).optional(),
    })
    .optional(),
});

const uploadDocumentSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  document_type: z.string().min(1, "Document type is required"),
  file_name: z.string().min(1, "File name is required"),
  file_url: z.string().url("File URL must be valid"),
});

const acceptOfferSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
});

module.exports = {
  filterIncubatorsSchema,
  applyIncubationSchema,
  updateApplicationSchema,
  uploadDocumentSchema,
  acceptOfferSchema,
};
