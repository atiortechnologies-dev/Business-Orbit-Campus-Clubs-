const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { listMeetings } = require("../controllers/meeting.controller");

router.use(protect, requireRole("student"));

router.get("/", listMeetings);

module.exports = router;
