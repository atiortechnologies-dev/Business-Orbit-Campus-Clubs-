/**
 * @file investorDiscovery.transactions.test.js
 * @description Verifies that multi-document writes in investor workflows roll back cleanly if a dependent operation fails.
 * @architecture Integration tests focusing on Mongoose transactions.
 */

const mongoose = require("mongoose");
const investorDiscoveryController = require("../../controllers/investorDiscovery.controller");
const InvestorWatchlist = require("../../models/InvestorWatchlist");
const Notification = require("../../models/Notification");
const Startup = require("../../models/Startup");

// Setup/Teardown logic relies on tests/setup.js running globally
// But we need to pre-create collections to avoid catalog changes error in transactions
beforeAll(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);

  const required = ["investorwatchlists", "notifications", "startups", "users"];
  for (const name of required) {
    if (!names.includes(name)) {
      await db.createCollection(name);
    }
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Investor Discovery Transactions", () => {
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn((err) => {
      if (err) console.error("NEXT ERROR:", err);
    });
  });

  describe("addToWatchlist", () => {
    it("should rollback watchlist creation if notification creation fails", async () => {
      // 1. Seed data
      const investorId = new mongoose.Types.ObjectId();
      const studentId = new mongoose.Types.ObjectId();
      const startup = await Startup.create({
        student_id: studentId,
        startup_name: "Test Startup",
        tagline: "Test",
        category: "Tech",
        description: "Test Desc",
      });

      // 2. Mock Notification.create to simulate failure
      jest
        .spyOn(Notification, "create")
        .mockRejectedValueOnce(new Error("Simulated Notification Failure"));

      // 3. Mock Express Request/Response
      const req = {
        body: { startup_id: startup._id.toString() },
        user: { _id: investorId },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // 4. Call Controller
      await investorDiscoveryController.addToWatchlist(req, res, mockNext);

      // 5. Assertions
      // Ensure the error was passed to next()
      expect(mockNext).toHaveBeenCalled();
      const errorArg = mockNext.mock.calls[0][0];
      expect(errorArg.message).toBe("Simulated Notification Failure");

      // Verify the transaction was rolled back
      // The Watchlist item should NOT have been created
      const watchlists = await InvestorWatchlist.find({
        investor_id: investorId,
      });
      expect(watchlists.length).toBe(0);
    });
  });
});
