const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSessionSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    device_name: { type: String },
    os_browser: { type: String },
    ip_address: { type: String },
    refresh_token_hash: { type: String, required: true },
    is_current: { type: Boolean, default: false },
    last_active_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("UserSession", userSessionSchema);
