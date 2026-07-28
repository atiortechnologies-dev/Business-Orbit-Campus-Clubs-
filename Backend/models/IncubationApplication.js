/**
 * @file IncubationApplication.js
 * @description Defines the schema for Student Incubation applications submitted to an Incubator.
 * @architecture Links Student, Startup, and IncubatorProfile with stage tracking and supporting documents.
 */

const mongoose = require("mongoose");

const incubationApplicationSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    incubator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubatorProfile",
      required: true,
    },
    application_status: {
      type: String,
      enum: [
        "Submitted",
        "Under Screening",
        "Under Review",
        "Interview Scheduled",
        "Accepted",
        "Rejected",
        "Withdrawn",
      ],
      default: "Submitted",
    },
    current_stage: {
      type: String,
      default: "Submitted",
      trim: true,
    },
    startup_info: {
      startup_name: { type: String, required: true, trim: true },
      startup_stage: { type: String, required: true, trim: true },
      industry: { type: String, required: true, trim: true },
      problem_statement: { type: String, required: true, trim: true },
      solution_summary: { type: String, required: true, trim: true },
    },
    business_details: {
      business_model: { type: String, default: "", trim: true },
      target_market: { type: String, default: "", trim: true },
      revenue_model: { type: String, default: "", trim: true },
    },
    team_info: {
      type: [
        {
          name: { type: String, trim: true },
          role: { type: String, trim: true },
          bio: { type: String, trim: true },
        },
      ],
      default: [],
    },
    supporting_documents: {
      pitch_deck: { type: String, required: true, trim: true },
      business_plan: { type: String, default: "", trim: true },
      mvp_link: { type: String, default: "", trim: true },
      demo_video: { type: String, default: "", trim: true },
      additional_docs: { type: [String], default: [] },
    },
    declaration_accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    terms_accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    accepted_by_student: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" } },
);

// Prevent duplicate active applications to the same incubator from the same student
incubationApplicationSchema.index(
  { student_id: 1, incubator_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      application_status: {
        $in: [
          "Submitted",
          "Under Screening",
          "Under Review",
          "Interview Scheduled",
        ],
      },
    },
  },
);

// Cascading delete for application dependents
incubationApplicationSchema.post(
  "findOneAndDelete",
  async function (doc, next) {
    if (doc) {
      const session = this.getOptions().session;
      const opts = session ? { session } : {};
      const ApplicationDocument = mongoose.model("ApplicationDocument");
      const ApplicationTimeline = mongoose.model("ApplicationTimeline");
      const IncubationAdmission = mongoose.model("IncubationAdmission");
      const IncubationUpdate = mongoose.model("IncubationUpdate");

      await ApplicationDocument.deleteMany({ application_id: doc._id }, opts);
      await ApplicationTimeline.deleteMany({ application_id: doc._id }, opts);
      await IncubationAdmission.deleteMany({ application_id: doc._id }, opts);
      await IncubationUpdate.deleteMany({ application_id: doc._id }, opts);
    }
    next();
  },
);

module.exports = mongoose.model(
  "IncubationApplication",
  incubationApplicationSchema,
);
