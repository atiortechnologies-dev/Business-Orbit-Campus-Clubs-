const express = require("express");

const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getMyChapter,
  requestChapterChange,
  getChapterStats,
} = require("../controllers/chapter.controller");

const studentChapterRouter = express.Router();

studentChapterRouter.use(protect, requireRole("student"));

// api/student ( Student can only access this router )
studentChapterRouter.get("/chapter", getMyChapter);
studentChapterRouter.post("/request-chapter-change", requestChapterChange);

// api/chapter
const chapterStatsRouter = express.Router();
chapterStatsRouter.get(
  "/:chapterId/stats",
  protect,
  requireRole("student"),
  getChapterStats,
);

module.exports = { studentChapterRouter, chapterStatsRouter };
