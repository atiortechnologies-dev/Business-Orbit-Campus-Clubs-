const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const Resource = require("../../models/Resource");
const User = require("../../models/User");
const { generateToken } = require("../../utils/token");

describe("Resource Controller", () => {
  let userJwt;

  beforeEach(async () => {
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Resource.init(); // Wait for indexes to build

    const user = await User.create({
      full_name: "Test User",
      email: "test@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    userJwt = generateToken(user._id, "student", "test@example.com");

    await Resource.create([
      {
        title: "Pitch Deck Guide",
        category: "Pitch Deck",
        description: "How to build a great pitch deck",
        file_url: "https://example.com/pitch.pdf",
      },
      {
        title: "Business Model Canvas",
        category: "Business Model",
        description: "Template for BMC",
        file_url: "https://example.com/bmc.pdf",
      },
    ]);
  });

  describe("listResources", () => {
    it("should list all resources without filters", async () => {
      const res = await request(app)
        .get("/api/resources")
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it("should filter by category", async () => {
      const res = await request(app)
        .get("/api/resources")
        .query({ category: "Pitch Deck" })
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Pitch Deck Guide");
    });

    it("should filter by search query (text index)", async () => {
      const res = await request(app)
        .get("/api/resources")
        .query({ search: "Template" })
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Business Model Canvas");
    });
  });

  describe("getResourceById", () => {
    it("should return 404 if resource is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/resources/${fakeId}`)
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Resource not found");
    });

    it("should return the resource and increment download_count", async () => {
      const resource = await Resource.findOne({ category: "Pitch Deck" });
      const initialDownloadCount = resource.download_count || 0;

      const res = await request(app)
        .get(`/api/resources/${resource._id}`)
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Pitch Deck Guide");
      expect(res.body.data.download_count).toBe(initialDownloadCount + 1);
    });
  });
});
