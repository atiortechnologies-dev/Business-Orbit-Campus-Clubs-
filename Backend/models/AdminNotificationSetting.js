const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminNotificationSettingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event_category: {
      type: String,
      enum: [
        "NEW_USER_REGISTRATION",
        "STARTUP_SUBMISSION",
        "OPPORTUNITY_SUBMISSION",
        "SUPPORT_TICKET_CREATED",
        "CHAPTER_MEMBERSHIP_CHANGE",
        "GLOBAL_ANNOUNCEMENT_SENT",
        "MEETING_SCHEDULED",
        "SECURITY_ALERTS",
      ],
      required: true,
    },
    in_app_enabled: { type: Boolean, default: true },
    email_enabled: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("AdminNotificationSetting", adminNotificationSettingSchema);
