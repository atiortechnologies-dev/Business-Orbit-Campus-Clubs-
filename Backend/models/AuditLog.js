const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditLogSchema = new Schema(
  {
    actor_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
    actor_name: { type: String },
    module: {
      type: String,
      enum: ["SECURITY", "CLUBS", "AUTH", "SYSTEM", "CONTENT", "OPPORTUNITIES", "CHAPTERS"],
      required: true,
    },
    action: { type: String, required: true },
    target_entity_id: { type: String },
    target_entity_name: { type: String },
    status: {
      type: String,
      enum: ["SUCCESS", "REJECTED", "PENDING"],
      required: true,
    },
    ip_address: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

auditLogSchema.index({ created_at: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
