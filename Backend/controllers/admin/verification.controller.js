const User = require("../../models/User");
const CompanyProfile = require("../../models/CompanyProfile");
const MentorProfile = require("../../models/MentorProfile");
const InvestorProfile = require("../../models/InvestorProfile");
const IncubatorProfile = require("../../models/IncubatorProfile");
const StudentProfile = require("../../models/StudentProfile");

// 1. getVerificationQueue
const getVerificationQueue = async (req, res) => {
  try {
    const queue = await User.find({ account_status: "pending_approval" })
      .select("-password_hash")
      .sort({ created_at: -1 });
    res.status(200).json(queue);
  } catch (error) {
    console.error("Error fetching verification queue:", error);
    res.status(500).json({ error: "Failed to fetch verification queue" });
  }
};

// 2. getVerificationDetails
const getVerificationDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password_hash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let profile = null;
    switch (user.role) {
      case "company":
        profile = await CompanyProfile.findOne({ user_id: user._id });
        break;
      case "mentor":
        profile = await MentorProfile.findOne({ user_id: user._id });
        break;
      case "investor":
        profile = await InvestorProfile.findOne({ user_id: user._id });
        break;
      case "incubator":
        profile = await IncubatorProfile.findOne({ user_id: user._id });
        break;
      case "student":
        profile = await StudentProfile.findOne({ user_id: user._id });
        break;
      default:
        break;
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    console.error("Error fetching verification details:", error);
    res.status(500).json({ error: "Failed to fetch verification details" });
  }
};

// 3. submitDecision
const submitDecision = async (req, res) => {
  try {
    const { decision, reason } = req.body;

    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision. Must be 'approve' or 'reject'." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (decision === "approve") {
      user.account_status = "active";
    } else {
      user.account_status = "rejected";
    }

    await user.save();

    res.status(200).json({ message: `User ${decision}d successfully.`, user });
  } catch (error) {
    console.error("Error submitting decision:", error);
    res.status(500).json({ error: "Failed to submit decision" });
  }
};

module.exports = {
  getVerificationQueue,
  getVerificationDetails,
  submitDecision
};
