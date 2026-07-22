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

module.exports = {
  scheduleMeetingSchema,
  sendMessageSchema,
  searchChatsQuerySchema,
};
