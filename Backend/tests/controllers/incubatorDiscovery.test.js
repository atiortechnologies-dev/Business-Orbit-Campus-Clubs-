/**
 * @file incubatorDiscovery.test.js
 * @description Jest test suite for Incubator Discovery endpoints.
 * @architecture Tests search, filtering, and detail loading of incubator programs.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const IncubatorProfile = require("../../models/IncubatorProfile");

describe("Incubator Discovery API", () => {
  let incubator1Id;
  let incubator2Id;

  beforeEach(async () => {
    await IncubatorProfile.deleteMany({});

    const inc1 = await IncubatorProfile.create({
      user_id: new mongoose.Types.ObjectId(),
      incubator_name: "Tech Hub Campus",
      organization: "Tech Hub Org",
      city: "Bangalore",
      location: "Bangalore",
      description: "Premier AI incubator",
      industry_focus: ["AI", "FinTech"],
      supported_stages: ["Stage 1", "Stage 2"],
      is_approved: true,
      application_deadline: new Date(Date.now() + 86400000 * 10),
    });
    incubator1Id = inc1._id;

    const inc2 = await IncubatorProfile.create({
      user_id: new mongoose.Types.ObjectId(),
      incubator_name: "Green Future Hub",
      organization: "Green Org",
      city: "Delhi",
      location: "Delhi",
      description: "CleanTech incubator",
      industry_focus: ["CleanTech"],
      supported_stages: ["Stage 3"],
      is_approved: true,
      application_deadline: new Date(Date.now() + 86400000 * 5),
    });
    incubator2Id = inc2._id;

    // Unapproved incubator should not appear in search
    await IncubatorProfile.create({
      user_id: new mongoose.Types.ObjectId(),
      incubator_name: "Secret Hub",
      organization: "Secret Org",
      city: "Mumbai",
      is_approved: false,
    });
  });

  describe("GET /api/incubators", () => {
    it("should list all approved incubators", async () => {
      const res = await request(app).get("/api/incubators").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.total).toBe(2);
      expect(res.body.data[0]).toHaveProperty("name");
      expect(res.body.data[0]).toHaveProperty("industry_focus");
    });

    it("should filter by search query string", async () => {
      const res = await request(app)
        .get("/api/incubators?search=CleanTech")
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe("Green Future Hub");
    });
  });

  describe("POST /api/incubators/filter", () => {
    it("should filter incubators by industry and stage", async () => {
      const res = await request(app)
        .post("/api/incubators/filter")
        .send({
          industry: "AI",
          stage: "Stage 1",
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe("Tech Hub Campus");
    });

    it("should sort by deadline ascending when requested", async () => {
      const res = await request(app)
        .post("/api/incubators/filter")
        .send({ sort: "deadline" })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].name).toBe("Green Future Hub"); // 5 days vs 10 days
    });
  });

  describe("GET /api/incubators/:id", () => {
    it("should load full details of an approved incubator by ID", async () => {
      const res = await request(app)
        .get(`/api/incubators/${incubator1Id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Tech Hub Campus");
      expect(res.body.data.description).toBe("Premier AI incubator");
    });

    it("should return 404 for non-existent or unapproved incubator", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/incubators/${fakeId}`).expect(404);
    });
  });
});
