const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const IncubationVerificationSchema = new mongoose.Schema(
  {
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      unique: true, // One verification per startup
    },

    // ========== INCUBATION DETAILS ==========
    incubator_name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    cohort_name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    expected_completion_date: {
      type: Date,
      required: true,
    },
    program_type: {
      type: String,
      enum: ["Pre-incubation", "Incubation", "Acceleration", "Scale-up"],
      required: true,
    },

    // ========== DOCUMENTS ==========
    documents: [
      {
        document_id: {
          type: String,
          unique: true,
          default: () => `DOC-${Date.now()}`,
        },
        document_type: {
          type: String,
          enum: [
            "Acceptance Letter",
            "Incubation Agreement",
            "Official Certificate",
            "Offer Letter",
            "Other",
          ],
        },
        file_name: String,
        file_url: String,
        file_size: Number,
        mime_type: String,
        uploaded_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ========== ADDITIONAL INFO ==========
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // ========== STATUS TRACKING ==========
    verification_status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Documents Requested",
        "Approved",
        "Rejected",
      ],
      default: "Draft",
    },
    submitted_at: Date,
    reviewed_at: Date,

    // ========== REVIEW DETAILS ==========
    assigned_reviewer: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    reviewer_comments: {
      type: String,
      maxlength: 2000,
      default: "",
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

// Indexes
IncubationVerificationSchema.index({ student_id: 1 });
IncubationVerificationSchema.index({ verification_status: 1 });
IncubationVerificationSchema.index({ startup_id: 1, verification_status: 1 });

module.exports = mongoose.model(
  "IncubationVerification",
  IncubationVerificationSchema,
);
