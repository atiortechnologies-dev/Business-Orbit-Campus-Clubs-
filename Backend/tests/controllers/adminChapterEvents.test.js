const request = require("supertest");
const express = require("express");
// Create a fake app since we mock controllers
const app = express();
app.use(express.json());

// Mock middleware
jest.mock("../../middlewares/requireAuth", () => (req, res, next) => {
  req.user = { id: "admin123", full_name: "Admin User" };
  next();
});

// Add mock user middleware
app.use((req, res, next) => {
  req.user = { id: "admin123", full_name: "Admin User" };
  next();
});

const chapterRoutes = require("../../routes/admin/chapter.routes");
app.use("/api/admin/chapters", chapterRoutes);

// Mock mongoose
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };
});

// Mock models
jest.mock("../../models/ChapterEvent", () => ({
  countDocuments: jest.fn(),
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../../models/AuditLog", () => ({
  create: jest.fn(),
}));

jest.mock("../../models/StudentProfile", () => ({
  find: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue([{ user_id: "student123" }]),
}));

jest.mock("../../models/Notification", () => ({
  insertMany: jest.fn(),
}));

const ChapterEvent = require("../../models/ChapterEvent");
const AuditLog = require("../../models/AuditLog");

describe("Admin Chapter Events API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/admin/chapters/:id/events", () => {
    it("should create a new chapter event successfully", async () => {
      ChapterEvent.create.mockResolvedValue([
        { _id: "event123", title: "Startup Mixer" },
      ]);
      AuditLog.create.mockResolvedValue([{}]);

      const response = await request(app)
        .post(`/api/admin/chapters/chap1/events`)
        .send({
          title: "Startup Mixer",
          description: "Networking event",
          category: "NETWORKING",
          event_date: new Date(Date.now() + 86400000).toISOString(),
          location_venue: "Hall A",
          max_capacity: 50,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe("Startup Mixer");
    });

    it("should return 400 if max_capacity <= 0", async () => {
      const response = await request(app)
        .post(`/api/admin/chapters/chap1/events`)
        .send({
          title: "Startup Mixer 2",
          description: "Networking",
          category: "NETWORKING",
          event_date: new Date(Date.now() + 86400000).toISOString(),
          location_venue: "Hall B",
          max_capacity: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 if missing fields", async () => {
      const response = await request(app)
        .post(`/api/admin/chapters/chap1/events`)
        .send({
          title: "Startup Mixer 2",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/admin/chapters/:id/events", () => {
    it("should list chapter events", async () => {
      ChapterEvent.countDocuments.mockResolvedValue(1);
      ChapterEvent.lean.mockResolvedValue([
        { title: "Event 1", total_registrations: 10 },
      ]);

      const response = await request(app).get(
        `/api/admin/chapters/chap1/events`,
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});
