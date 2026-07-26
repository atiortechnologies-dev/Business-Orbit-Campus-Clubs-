const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ProductSubmissionSchema = new mongoose.Schema(
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

    // ========== PRODUCT INFO ==========
    product_version: {
      type: String,
      required: true,
      maxlength: 50,
    },

    update_summary: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // ========== SUBMISSION ASSETS ==========
    demo_url: String,
    repository_url: String,
    product_url: String,
    presentation_url: String,
    demo_video_url: String,

    // Supporting documents
    documents: [
      {
        file_id: {
          type: String,
          unique: true,
          default: () => `DOC-${Date.now()}`,
        },
        file_name: String,
        file_url: String,
        file_type: String,
        uploaded_at: Date,
      },
    ],

    // Status
    submission_status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Changes Requested",
        "Approved",
        "Rejected",
      ],
      default: "Draft",
    },

    submitted_at: Date,

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

ProductSubmissionSchema.index({ startup_id: 1 });
ProductSubmissionSchema.index({ student_id: 1 });
ProductSubmissionSchema.index({ submission_status: 1 });

module.exports = mongoose.model("ProductSubmission", ProductSubmissionSchema);
