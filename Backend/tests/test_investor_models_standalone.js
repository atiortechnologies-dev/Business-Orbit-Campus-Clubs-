/**
 * @file test_investor_models_standalone.js
 * @description Standalone test script for verifying Investor Access Mongoose data model validations.
 */

const mongoose = require("mongoose");
const assert = require("assert");

const InvestorProfile = require("../models/InvestorProfile");
const PitchSubmission = require("../models/PitchSubmission");
const PitchDocument = require("../models/PitchDocument");
const InvestorChatRoom = require("../models/InvestorChatRoom");
const InvestorMessage = require("../models/InvestorMessage");

console.log("Running Investor Models Standalone Verification Tests...\n");

try {
  // Test 1: InvestorProfile
  const investor = new InvestorProfile({
    user_id: new mongoose.Types.ObjectId(),
    organization: "Sequoia",
    investment_focus: "Tech",
    investment_stage: "Seed",
    funding_range: "$100k-$500k",
  });
  let err = investor.validateSync();
  assert.strictEqual(err, undefined, "InvestorProfile should validate");
  assert.strictEqual(investor.account_status, "pending");
  console.log("✅ InvestorProfile model validation passed.");

  // Test 2: PitchSubmission
  const submission = new PitchSubmission({
    startup_id: new mongoose.Types.ObjectId(),
    investor_id: new mongoose.Types.ObjectId(),
    funding_requirement: "$2M",
    startup_stage: "Series A",
  });
  err = submission.validateSync();
  assert.strictEqual(err, undefined, "PitchSubmission should validate");
  assert.strictEqual(submission.status, "draft");
  console.log("✅ PitchSubmission model validation passed.");

  // Test 3: PitchDocument
  const doc = new PitchDocument({
    submission_id: new mongoose.Types.ObjectId(),
    document_type: "pitch_deck",
    file_name: "deck.pdf",
    file_url: "http://example.com/deck.pdf",
  });
  err = doc.validateSync();
  assert.strictEqual(err, undefined, "PitchDocument should validate");
  console.log("✅ PitchDocument model validation passed.");

  // Test 4: InvestorChatRoom
  const chat = new InvestorChatRoom({
    investor_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
  });
  err = chat.validateSync();
  assert.strictEqual(err, undefined, "InvestorChatRoom should validate");
  console.log("✅ InvestorChatRoom model validation passed.");

  // Test 5: InvestorMessage
  const msg = new InvestorMessage({
    chat_id: new mongoose.Types.ObjectId(),
    sender_id: new mongoose.Types.ObjectId(),
    message: "Let's talk",
  });
  err = msg.validateSync();
  assert.strictEqual(err, undefined, "InvestorMessage should validate");
  assert.strictEqual(msg.attachment_url, "");
  console.log("✅ InvestorMessage model validation passed.");

  console.log("\n✅ ALL INVESTOR MODEL VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
}
