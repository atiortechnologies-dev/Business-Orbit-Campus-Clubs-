/**
 * @file ChatRoom.js
 * @description Schema representing a chat room between a mentor and a student/startup.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Ensure only one chat room per mentor-student-startup combo
chatRoomSchema.index(
  { mentor_id: 1, student_id: 1, startup_id: 1 },
  { unique: true },
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
