const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.use(protect, requireRole("student"));

router.get("/", meetingController.listMeetings);

module.exports = router;
