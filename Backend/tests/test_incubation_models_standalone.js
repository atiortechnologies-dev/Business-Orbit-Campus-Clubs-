/**
 * @file test_incubation_models_standalone.js
 * @description Standalone test script for verifying Incubation module data model validations.
 */

const mongoose = require("mongoose");
const assert = require("assert");

const IncubatorProfile = require("../models/IncubatorProfile");
const IncubationApplication = require("../models/IncubationApplication");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationTimeline = require("../models/ApplicationTimeline");
const IncubationAdmission = require("../models/IncubationAdmission");
const AdmissionDocument = require("../models/AdmissionDocument");
const IncubationUpdate = require("../models/IncubationUpdate");

console.log("Running Incubation Models Standalone Verification Tests...\n");

try {
  // 1. IncubatorProfile
  const inc = new IncubatorProfile({
    user_id: new mongoose.Types.ObjectId(),
    incubator_name: "Y-Combinator Campus",
    organization: "YC",
    city: "Bangalore",
    description: "Top tier campus incubator",
    industry_focus: ["FinTech", "EdTech"],
  });
  let err = inc.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "IncubatorProfile should validate cleanly",
  );
  assert.strictEqual(inc.is_approved, true);
  console.log("✅ IncubatorProfile model validation passed.");

  // 2. IncubationApplication
  const app = new IncubationApplication({
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
    incubator_id: new mongoose.Types.ObjectId(),
    startup_info: {
      startup_name: "Orbit AI",
      startup_stage: "Stage 2",
      industry: "AI",
      problem_statement: "Slow data processing",
      solution_summary: "Fast AI agents",
    },
    supporting_documents: {
      pitch_deck: "http://example.com/deck.pdf",
    },
    declaration_accepted: true,
    terms_accepted: true,
  });
  err = app.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "IncubationApplication should validate cleanly",
  );
  assert.strictEqual(app.application_status, "Submitted");
  console.log("✅ IncubationApplication model validation passed.");

  // 3. ApplicationDocument
  const doc = new ApplicationDocument({
    application_id: new mongoose.Types.ObjectId(),
    document_type: "Pitch Deck",
    file_name: "deck.pdf",
    file_url: "http://example.com/deck.pdf",
  });
  err = doc.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "ApplicationDocument should validate cleanly",
  );
  console.log("✅ ApplicationDocument model validation passed.");

  // 4. ApplicationTimeline
  const time = new ApplicationTimeline({
    application_id: new mongoose.Types.ObjectId(),
    status: "Submitted",
    remarks: "Application received",
  });
  err = time.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "ApplicationTimeline should validate cleanly",
  );
  console.log("✅ ApplicationTimeline model validation passed.");

  // 5. IncubationAdmission
  const adm = new IncubationAdmission({
    application_id: new mongoose.Types.ObjectId(),
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
    incubator_id: new mongoose.Types.ObjectId(),
    program_name: "Cohort 2026",
  });
  err = adm.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "IncubationAdmission should validate cleanly",
  );
  assert.strictEqual(adm.onboarding_status, "Pending");
  console.log("✅ IncubationAdmission model validation passed.");

  // 6. AdmissionDocument
  const adDoc = new AdmissionDocument({
    admission_id: new mongoose.Types.ObjectId(),
    document_type: "Acceptance Letter",
    file_name: "letter.pdf",
    file_url: "http://example.com/letter.pdf",
  });
  err = adDoc.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "AdmissionDocument should validate cleanly",
  );
  console.log("✅ AdmissionDocument model validation passed.");

  // 7. IncubationUpdate
  const upd = new IncubationUpdate({
    incubator_id: new mongoose.Types.ObjectId(),
    title: "Welcome Cohort",
    description: "Orientation begins next week.",
  });
  err = upd.validateSync();
  assert.strictEqual(
    err,
    undefined,
    "IncubationUpdate should validate cleanly",
  );
  console.log("✅ IncubationUpdate model validation passed.");

  console.log("\nALL PHASE 1 MODEL VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀");
  process.exit(0);
} catch (error) {
  console.error("❌ Test Failed:", error);
  process.exit(1);
}
