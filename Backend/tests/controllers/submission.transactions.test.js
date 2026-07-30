const mongoose = require("mongoose");
const submissionController = require("../../controllers/submission.controller");
const StartupStage = require("../../models/StartupStage");
const StageSubmission = require("../../models/StageSubmission");
const User = require("../../models/User");
const Startup = require("../../models/Startup");

describe("Submission Controller - Transactions", () => {
  let user, startup, stage;

  beforeAll(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    const required = ["startups", "startupstages", "stagesubmissions", "users"];
    for (const name of required) {
      if (!names.includes(name)) {
        await db.createCollection(name);
      }
    }

    user = await User.create({
      full_name: "Test Founder",
      email: "founder2@example.com",
      password_hash: "password123",
      role: "student",
      isEmailVerified: true,
    });

    startup = await Startup.create({
      startup_name: "Test Startup 2",
      student_id: user._id,
      category: "EdTech",
    });

    stage = await StartupStage.create({
      startup_id: startup._id,
      stage_number: 1,
      status: "active",
      stage_name: "Ideation",
      description: "Define idea",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await StartupStage.deleteMany({});
    await StageSubmission.deleteMany({});
  });

  it("should rollback submission creation if activeStage update fails", async () => {
    const originalSave = StartupStage.prototype.save;
    StartupStage.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Simulated activeStage save failure"));

    const req = {
      user: { id: user._id },
      validatedData: {
        title: "My Idea",
        description: "A great edtech idea",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the controller directly
    await submissionController.submitIdea(req, res, next);

    // Expect next to have been called with the error
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe(
      "Simulated activeStage save failure",
    );

    // Verify rollback
    const submissionCount = await StageSubmission.countDocuments({
      startup_id: startup._id,
    });
    expect(submissionCount).toBe(0);

    const updatedStage = await StartupStage.findById(stage._id);
    expect(updatedStage.status).toBe("active"); // Status shouldn't have changed

    StartupStage.prototype.save = originalSave;
  });
});
