/**
 * @file meeting.routes.js
 * @description Handles endpoints for listing and managing meetings for students.
 * @architecture Globally guarded by the student role middleware.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { listMeetings } = require("../controllers/meeting.controller");

router.use(protect, requireRole("student"));

router.get("/", listMeetings);

/**
 * @module meetingRouter
 * @description Express router for student meeting endpoints.
 */
module.exports = router;
