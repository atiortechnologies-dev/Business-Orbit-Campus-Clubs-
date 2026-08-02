const express = require("express");
const router = express.Router();
const {
  prepareMeetingContext,
  scheduleMeeting
} = require("../../controllers/admin/meeting.controller");

router.get("/prepare", prepareMeetingContext);
router.post("/schedule", scheduleMeeting);

module.exports = router;
