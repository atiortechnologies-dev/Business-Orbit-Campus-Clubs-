const express = require("express");

const chapterController = require("../controllers/chapterController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

//* Mounted at /api/student ( Student can only access this router )
const studentChapterRouter = express.Router();
studentChapterRouter.use(protect, requireRole("student"));
studentChapterRouter.get("/chapter", chapterController.getMyChapter);
studentChapterRouter.post(
  "/request-chapter-change",
  chapterController.requestChapterChange,
);

//* Mounted at /api/chapter
const chapterStatsRouter = express.Router();
chapterStatsRouter.get(
  "/:chapterId/stats",
  protect,
  requireRole("student"),
  chapterController.getChapterStats,
);

module.exports = { studentChapterRouter, chapterStatsRouter };
