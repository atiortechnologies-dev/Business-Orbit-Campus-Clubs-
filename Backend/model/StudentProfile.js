const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    college: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    graduation_year: { type: Number, required: true },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" }, // e.g. "/uploads/profile-photos/xyz.jpg"
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] }, // skills / expertise / interests
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    startup_interests: { type: [String], default: [] },
    areas_of_interest: { type: [String], default: [] },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
