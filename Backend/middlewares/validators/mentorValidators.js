/**
 * @file mentorValidators.js
 * @description Zod schemas for validating incoming requests related to mentor features (meetings, chats).
 * @architecture Validation layer ensuring data integrity before reaching controllers.
 */

const { z } = require("zod");

/**
 * Validates the payload for scheduling a meeting
 */
const scheduleMeetingSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  startupId: z.string().min(1, "Startup ID is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  time: z.string().min(1, "Time is required"),
  platform: z.string().min(1, "Platform is required"),
  meetingLink: z.string().url("Valid meeting link is required"),
});

/**
 * Validates the payload for sending a chat message
 */
const sendMessageSchema = z.object({
  message: z.string().trim().min(1, "Message content cannot be empty"),
});

/**
 * Validates the search query parameter for chats
 */
const searchChatsQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
});

/**
 * Validates the payload for adding meeting notes
 */
const addMeetingNotesSchema = z.object({
  mentor_notes: z.string().trim().min(1, "Mentor notes are required"),
  recommendations: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
});

/**
 * Validates the payload for updating a mentor profile
 */
const updateMentorProfileSchema = z.object({
  organization: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  expertise: z.string().trim().optional(),
  years_of_experience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .optional(),
  bio: z.string().trim().optional(),
  skills: z.array(z.string().trim()).optional(),
  linkedin_url: z
    .string()
    .url("Valid LinkedIn URL is required")
    .or(z.literal(""))
    .optional(),
  portfolio_url: z
    .string()
    .url("Valid Portfolio URL is required")
    .or(z.literal(""))
    .optional(),
  // Structure: A standard dictionary of string URLs, e.g. { "twitter": "https://twitter.com/...", "github": "https://github.com/..." }
  social_links: z.record(z.string().url("Valid URL required")).optional(),
  availability: z.string().trim().optional(),
  full_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

module.exports = {
  scheduleMeetingSchema,
  sendMessageSchema,
  searchChatsQuerySchema,
  addMeetingNotesSchema,
  updateMentorProfileSchema,
};
