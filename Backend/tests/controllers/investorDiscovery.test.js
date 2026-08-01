/**
 * @file investorDiscovery.test.js
 * @description Tests for Investor Startup Discovery controller.
 */

const mongoose = require("mongoose");
const investorDiscoveryController = require("../../controllers/investorDiscovery.controller");
const StartupPitch = require("../../models/StartupPitch");
const InvestorWatchlist = require("../../models/InvestorWatchlist");
const PitchView = require("../../models/PitchView");
const Startup = require("../../models/Startup");
const _User = require("../../models/User");

describe("Investor Discovery Controller", () => {
  let investorId, founderId, startup, pitch;

  beforeEach(async () => {
    // Clear collections
    await StartupPitch.deleteMany({});
    await InvestorWatchlist.deleteMany({});
    await PitchView.deleteMany({});
    await Startup.deleteMany({});

    investorId = new mongoose.Types.ObjectId();
    founderId = new mongoose.Types.ObjectId();

    startup = await Startup.create({
      student_id: founderId,
      startup_name: "Test Startup",
      category: "Tech",
    });

    pitch = await StartupPitch.create({
      startup_id: startup._id,
      founder_id: founderId,
      industry: "Tech",
      funding_stage: "Seed",
      funding_amount: "$1M",
      deck_file: "http://example.com/pitch.pdf",
      status: "active",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn((err) => {
    if (err) console.error("NEXT ERROR:", err);
  });

  describe("getDashboard", () => {
    it("should return recent pitches and watchlist", async () => {
      const req = { user: { _id: investorId } };
      const res = mockResponse();

      await investorDiscoveryController.getDashboard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            recentPitches: expect.any(Array),
            watchlist: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("trackPitchView", () => {
    it("should create a PitchView record", async () => {
      const req = {
        body: { pitch_id: pitch._id },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.trackPitchView(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);

      const view = await PitchView.findOne({
        investor_id: investorId,
        pitch_id: pitch._id,
      });
      expect(view).not.toBeNull();
    });
  });

  describe("addToWatchlist", () => {
    it("should add a startup to the watchlist", async () => {
      const req = {
        body: { startup_id: startup._id },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.addToWatchlist(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);

      const item = await InvestorWatchlist.findOne({
        investor_id: investorId,
        startup_id: startup._id,
      });
      expect(item).not.toBeNull();
    });

    it("should reject duplicates", async () => {
      await InvestorWatchlist.create({
        investor_id: investorId,
        startup_id: startup._id,
      });

      const req = {
        body: { startup_id: startup._id },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.addToWatchlist(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Startup is already in your watchlist",
      });
    });
  });

  describe("getStats", () => {
    it("should return investor stats", async () => {
      const req = { user: { _id: investorId } };
      const res = mockResponse();

      await investorDiscoveryController.getStats(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            totalPitches: 1,
            watchlistCount: 0,
            reviewedCount: 0,
            activeConversations: 0,
          }),
        }),
      );
    });
  });

  describe("getRecommendations", () => {
    it("should return recommended pitches", async () => {
      const req = {};
      const res = mockResponse();

      await investorDiscoveryController.getRecommendations(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
    });
  });

  describe("getPitches", () => {
    it("should return all active pitches and test pagination", async () => {
      const req = { query: { page: "1", limit: "10" } };
      const res = mockResponse();

      await investorDiscoveryController.getPitches(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].success).toBe(true);
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
      expect(res.json.mock.calls[0][0].pagination.total).toBe(1);
    });

    it("should filter by search text against startup_name", async () => {
      const req = { query: { search: "Test" } };
      const res = mockResponse();

      await investorDiscoveryController.getPitches(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
      expect(res.json.mock.calls[0][0].data[0].startup_id.startup_name).toBe(
        "Test Startup",
      );
    });
  });

  describe("getPitchDetails", () => {
    it("should return pitch details", async () => {
      const req = { params: { id: pitch._id } };
      const res = mockResponse();

      await investorDiscoveryController.getPitchDetails(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            _id: pitch._id,
          }),
        }),
      );
    });
  });

  describe("filterPitches", () => {
    it("should return filtered pitches by industry", async () => {
      const req = { body: { industry: "Tech" }, query: {} };
      const res = mockResponse();

      await investorDiscoveryController.filterPitches(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
      expect(res.json.mock.calls[0][0].pagination.total).toBe(1);
    });

    it("should not return pitches for non-matching industry", async () => {
      const req = { body: { industry: "Healthcare" }, query: {} };
      const res = mockResponse();

      await investorDiscoveryController.filterPitches(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(0);
      expect(res.json.mock.calls[0][0].pagination.total).toBe(0);
    });
  });

  describe("removeFromWatchlist", () => {
    it("should remove item from watchlist and cascade delete Notification", async () => {
      const Notification = require("../../models/Notification");
      const item = await InvestorWatchlist.create({
        investor_id: investorId,
        startup_id: startup._id,
      });

      await Notification.create({
        recipient_id: founderId,
        title: "Test",
        message: "Test msg",
        type: "watchlist",
        related_id: item._id,
      });

      const req = {
        params: { startupId: startup._id },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.removeFromWatchlist(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      const remaining = await InvestorWatchlist.countDocuments({
        investor_id: investorId,
      });
      expect(remaining).toBe(0);

      const remainingNotif = await Notification.countDocuments({
        related_id: item._id,
      });
      expect(remainingNotif).toBe(0);
    });
  });

  describe("addNote", () => {
    it("should add a private note", async () => {
      const req = {
        body: { startup_id: startup._id, note: "Interesting" },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.addNote(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("requestMeeting", () => {
    it("should request a meeting", async () => {
      const req = {
        body: {
          startup_id: startup._id,
          meeting_date: new Date(Date.now() + 86400000),
          meeting_link: "link",
        },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.requestMeeting(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("startConversation", () => {
    it("should create or return chatroom", async () => {
      const req = {
        body: {
          founder_id: founderId,
          startup_id: startup._id,
          message: "Hello",
        },
        user: { _id: investorId },
      };
      const res = mockResponse();

      await investorDiscoveryController.startConversation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
