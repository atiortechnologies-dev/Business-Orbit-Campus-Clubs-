const mongoose = require("mongoose");

const incubatorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    incubator_name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    website: { type: String, trim: true, default: "" },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    organization_type: { type: String, trim: true, default: "" },
    supported_startup_domains: { type: [String], default: [] },
    services_offered: { type: [String], default: [] },
    contact_person: { type: String, trim: true, default: "" },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("IncubatorProfile", incubatorProfileSchema);
