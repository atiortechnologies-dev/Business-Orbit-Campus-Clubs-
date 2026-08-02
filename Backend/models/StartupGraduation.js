const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StartupGraduationSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },

    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    graduation_date: {
      type: Date,
      default: Date.now,
    },

    total_duration: Number,

    final_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    certificate_url: String,

    alumni_status: {
      type: String,
      enum: ["Not Joined", "Joined"],
      default: "Not Joined",
    },

    mentor_application_submitted: {
      type: Boolean,
      default: false,
    },

    showcase_application_submitted: {
      type: Boolean,
      default: false,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

StartupGraduationSchema.index({ startup_id: 1 });
StartupGraduationSchema.index({ student_id: 1 });

module.exports = mongoose.model("StartupGraduation", StartupGraduationSchema);
