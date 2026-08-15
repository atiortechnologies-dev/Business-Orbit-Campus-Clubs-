/**
 * @file chapter.routes.js
 * @description Configures chapter-related routing for student actions and chapter statistics.
 * @architecture Separated into two distinct routers with applied role-based access control.
 */

const express = require("express");

const {
  getMyChapter,
  requestChapterChange,
  getChapterStats,
} = require("../controllers/chapter.controller");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

/**
 * @module studentChapterRouter
 * @description Express router for student-specific chapter actions.
 */
const studentChapterRouter = express.Router();

studentChapterRouter.use(requireAuth, requireRole("student"));

// api/student ( Student can only access this router )
studentChapterRouter.get("/chapter", getMyChapter);
studentChapterRouter.post("/request-chapter-change", requestChapterChange);

// api/chapter
/**
 * @module chapterStatsRouter
 * @description Express router for fetching general chapter statistics.
 */
const chapterStatsRouter = express.Router();
chapterStatsRouter.get(
  "/:chapterId/stats",
  requireAuth,
  requireRole("student"),
  getChapterStats,
);

module.exports = { studentChapterRouter, chapterStatsRouter };
