/**
 * @file LaunchEvidenceFile.js
 * @description Defines the Mongoose schema and model for evidence files submitted during a startup's launch.
 * @architecture Acts as a data model within the storage architecture for tracking multimedia evidence such as photos and presentations for launches.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchEvidenceFileSchema = new mongoose.Schema(
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

    evidence_type: {
      type: String,
      enum: [
        "launch_photo",
        "launch_video",
        "stage_presentation",
        "product_screenshot",
        "media_coverage",
        "testimonial",
      ],
      required: true,
    },

    file_url: String,

    uploaded_at: {
      type: Date,
      default: Date.now,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

LaunchEvidenceFileSchema.index({ startup_id: 1 });
LaunchEvidenceFileSchema.index({ evidence_type: 1 });

/**
 * @module LaunchEvidenceFile
 * @description Exports the LaunchEvidenceFile Mongoose model.
 */
module.exports = mongoose.model("LaunchEvidenceFile", LaunchEvidenceFileSchema);
