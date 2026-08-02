/**
 * @file chapter.routes.js
 * @description Chapter governance administrative routes.
 * @architecture Mounted under /api/admin/chapters. Inherits adminAuth from admin.routes.js.
 */

const express = require("express");
const {
  getChapters,
  getChapterOverview,
  getChapterStudents,
  getChapterStartups,
  assignChapterLead,
  getChapterEvents,
  createChapterEvent,
} = require("../../controllers/admin/chapter.controller");

const router = express.Router();

router.get("/", getChapters);
router.get("/:id/overview", getChapterOverview);
router.get("/:id/students", getChapterStudents);
router.get("/:id/startups", getChapterStartups);
router.put("/:id/assign-lead", assignChapterLead);

// Chapter Events
router.get("/:id/events", getChapterEvents);
router.post("/:id/events", createChapterEvent);

module.exports = router;
