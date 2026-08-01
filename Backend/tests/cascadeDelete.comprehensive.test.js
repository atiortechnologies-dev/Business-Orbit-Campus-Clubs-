/**
 * @file cascadeDelete.comprehensive.test.js
 * @description Comprehensive integration test for cascading deletions.
 * @architecture Validates that deleting a User (Company/Student/Investor) successfully cleans up deeply nested relational data.
 */

const _request = require("supertest");
const { _app, server } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/User");
const Startup = require("../models/Startup");

const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const ApplicantStatus = require("../models/ApplicantStatus");
const ApplicationInterview = require("../models/ApplicationInterview");
const RecruiterNote = require("../models/RecruiterNote");

const StartupPitch = require("../models/StartupPitch");
const PitchView = require("../models/PitchView");
const InvestorWatchlist = require("../models/InvestorWatchlist");
const InvestorNote = require("../models/InvestorNote");
const InvestorChatRoom = require("../models/InvestorChatRoom");
const InvestorMessage = require("../models/InvestorMessage");

describe("Comprehensive Cascading Deletions", () => {
  let studentUser;
  let companyUser;
  let investorUser;
  let startup;
  let opportunity;
  let application;
  let startupPitch;
  let invChatRoom;

  beforeAll(async () => {
    // Setup handled by server import
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    server.close();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }

    const uniqueExt = new mongoose.Types.ObjectId();

    // 1. Create Users
    studentUser = await User.create({
      full_name: "Test Student",
      email: `student_${uniqueExt}@test.com`,
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
    });

    companyUser = await User.create({
      full_name: "Test Company",
      email: `company_${uniqueExt}@test.com`,
      password_hash: "hashedpass",
      role: "company",
      account_status: "active",
    });

    investorUser = await User.create({
      full_name: "Test Investor",
      email: `investor_${uniqueExt}@test.com`,
      password_hash: "hashedpass",
      role: "investor",
      account_status: "active",
    });

    // 2. Create Startup Ecosystem
    startup = await Startup.create({
      student_id: studentUser._id,
      startup_name: "Cascade Startup",
      current_stage: 1,
    });

    startupPitch = await StartupPitch.create({
      startup_id: startup._id,
      founder_id: studentUser._id,
      industry: "Tech",
      funding_stage: "Seed",
      funding_amount: "100k",
      deck_file: "url",
    });

    await PitchView.create({
      investor_id: investorUser._id,
      pitch_id: startupPitch._id,
    });

    await InvestorWatchlist.create({
      investor_id: investorUser._id,
      startup_id: startup._id,
    });

    await InvestorNote.create({
      investor_id: investorUser._id,
      startup_id: startup._id,
      note: "Promising idea.",
    });

    invChatRoom = await InvestorChatRoom.create({
      investor_id: investorUser._id,
      founder_id: studentUser._id,
      startup_id: startup._id,
    });

    await InvestorMessage.create({
      chat_id: invChatRoom._id,
      sender_id: investorUser._id,
      receiver_id: studentUser._id,
      message: "Hello founder!",
    });

    // 3. Create Company Ecosystem
    opportunity = await Opportunity.create({
      company_id: companyUser._id,
      title: "Software Engineer",
      type: "Job",
      description: "Code things.",
      application_deadline: new Date(),
    });

    application = await Application.create({
      opportunity_id: opportunity._id,
      student_id: studentUser._id,
      resume_url: "url",
    });

    await ApplicantStatus.create({
      application_id: application._id,
      status: "applied",
      updated_by: studentUser._id,
    });

    await ApplicationInterview.create({
      application_id: application._id,
      interview_date: new Date(),
      meeting_link: "url",
    });

    await RecruiterNote.create({
      application_id: application._id,
      recruiter_id: companyUser._id,
      note: "Strong candidate.",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should cascade delete all Company dependencies (Opportunity, Application, etc.)", async () => {
    const cascadeService = require("../services/cascadeService");
    await cascadeService.deleteUserDependencies(companyUser._id);
    await User.findByIdAndDelete(companyUser._id);

    // Verify Company is gone
    expect(await User.findById(companyUser._id)).toBeNull();

    // Verify Opportunity is gone
    expect(
      await Opportunity.findOne({ company_id: companyUser._id }),
    ).toBeNull();

    // Verify Application is gone (cascaded from Opportunity)
    expect(await Application.findById(application._id)).toBeNull();

    // Verify nested application artifacts are gone
    expect(
      await ApplicantStatus.findOne({ application_id: application._id }),
    ).toBeNull();
    expect(
      await ApplicationInterview.findOne({ application_id: application._id }),
    ).toBeNull();
    expect(
      await RecruiterNote.findOne({ application_id: application._id }),
    ).toBeNull();
  });

  it("should cascade delete all Investor dependencies", async () => {
    const cascadeService = require("../services/cascadeService");
    await cascadeService.deleteUserDependencies(investorUser._id);
    await User.findByIdAndDelete(investorUser._id);

    expect(await User.findById(investorUser._id)).toBeNull();
    expect(
      await InvestorWatchlist.findOne({ investor_id: investorUser._id }),
    ).toBeNull();
    expect(
      await InvestorNote.findOne({ investor_id: investorUser._id }),
    ).toBeNull();
    expect(
      await PitchView.findOne({ investor_id: investorUser._id }),
    ).toBeNull();

    // Chat & Messages
    expect(await InvestorChatRoom.findById(invChatRoom._id)).toBeNull();
    expect(
      await InvestorMessage.findOne({ chat_id: invChatRoom._id }),
    ).toBeNull();
  });

  it("should cascade delete all Student dependencies", async () => {
    const cascadeService = require("../services/cascadeService");
    await cascadeService.deleteUserDependencies(studentUser._id);
    await User.findByIdAndDelete(studentUser._id);

    // Verify Student is gone
    expect(await User.findById(studentUser._id)).toBeNull();

    // Verify Application is gone (cascaded directly from Student)
    expect(await Application.findById(application._id)).toBeNull();
    expect(
      await ApplicantStatus.findOne({ application_id: application._id }),
    ).toBeNull();

    // Verify Startup is gone
    expect(await Startup.findById(startup._id)).toBeNull();

    // Verify StartupPitch is gone (cascaded from Startup wipe)
    expect(await StartupPitch.findById(startupPitch._id)).toBeNull();

    // Verify Watchlist/Notes tied to Startup are gone
    expect(
      await InvestorWatchlist.findOne({ startup_id: startup._id }),
    ).toBeNull();
    expect(await InvestorNote.findOne({ startup_id: startup._id })).toBeNull();
  });
});
