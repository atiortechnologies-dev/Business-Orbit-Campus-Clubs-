const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const AtiorAssistanceRequestSchema = new mongoose.Schema(
  {
    request_id: {
      type: String,
      unique: true,
      default: () => `REQ-${Date.now()}`,
    },

    // Link to student and startup
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },

    // Request Details
    assistance_type: {
      type: String,
      enum: [
        "Full Development",
        "Frontend Development",
        "Backend Development",
        "Mobile Development",
        "Design",
        "DevOps & Deployment",
        "Database Design",
        "API Integration",
        "Other",
      ],
      required: true,
    },

    project_description: {
      type: String,
      required: true,
      maxlength: 3000,
    },

    technologies: {
      type: [String], // e.g., ["React", "Node.js", "MongoDB"]
      required: true,
    },

    timeline: {
      type: String,
      enum: ["1-2 weeks", "3-4 weeks", "1-2 months", "2+ months"],
      required: true,
    },

    budget: {
      type: Number,
      min: 0,
      default: null, // Optional
    },

    additional_notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // Status Management
    request_status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Approved",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    assigned_to: {
      type: ObjectId,
      ref: "User", // for now ( temporary )
      default: null, // Atior team member
    },

    assigned_at: Date,

    // Responses from Atior
    atior_response: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    atior_contact_email: {
      type: String,
      default: "",
    },

    atior_response_date: Date,

    // Timestamps
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

// Indexes
AtiorAssistanceRequestSchema.index({ startup_id: 1 });
AtiorAssistanceRequestSchema.index({ student_id: 1 });
AtiorAssistanceRequestSchema.index({ request_status: 1 });
AtiorAssistanceRequestSchema.index({ startup_id: 1, request_status: 1 });

module.exports = mongoose.model(
  "AtiorAssistanceRequest",
  AtiorAssistanceRequestSchema,
);
