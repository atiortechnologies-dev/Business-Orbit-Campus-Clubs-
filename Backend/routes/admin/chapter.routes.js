/**
 * @file chapter.routes.js
 * @description Chapter governance administrative routes.
 * @architecture Mounted under /api/admin/chapters. Inherits adminAuth from admin.routes.js.
 */

const express = require("express");
const {
  getChapterOverview,
  getChapterStudents,
  getChapterStartups,
  assignChapterLead,
} = require("../../controllers/admin/chapter.controller");

const router = express.Router();

router.get("/:id/overview", getChapterOverview);
router.get("/:id/students", getChapterStudents);
router.get("/:id/startups", getChapterStartups);
router.put("/:id/assign-lead", assignChapterLead);

module.exports = router;
