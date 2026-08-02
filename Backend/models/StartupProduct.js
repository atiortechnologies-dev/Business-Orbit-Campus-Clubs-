const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StartupProductSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      // unique: true,
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    product_type: {
      type: String,
      enum: ["Digital", "Physical"],
      required: true,
    },
    product_description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    selected_at: {
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

StartupProductSchema.index({ startup_id: 1 });

module.exports = mongoose.model("StartupProduct", StartupProductSchema);
