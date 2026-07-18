const mongoose = require("mongoose");

const investorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    organization: { type: String, required: true, trim: true }, // Organization / Fund name
    investment_focus: { type: String, required: true, trim: true },
    investment_stage: { type: String, required: true, trim: true },
    profile_url: { type: String, trim: true, default: "" },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    investor_type: {
      type: String,
      enum: ["Angel", "VC", "Corporate"],
      default: null,
    },
    investment_sectors: { type: [String], default: [] },
    preferred_startup_stages: { type: [String], default: [] },
    investment_range: { type: String, trim: true, default: "" },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("InvestorProfile", investorProfileSchema);
