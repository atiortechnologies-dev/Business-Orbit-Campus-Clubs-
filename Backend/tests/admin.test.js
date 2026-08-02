/**
 * @file admin.test.js
 * @description Integration tests for admin API routes (FAQs, PartnerLogos).
 * @architecture Validates the admin controller logic, authentication, and generic CRUD helpers.
 */

const request = require("supertest");
const express = require("express");

jest.mock("../middlewares/authMiddleware", () => ({
  protect: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === "Bearer valid-token") {
      req.user = { id: "admin1", role: "admin" };
      return next();
    }
    return res.status(401).json({ success: false, message: "Not authorized" });
  },
  requireRole: (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  }
}));

const adminRoutes = require("../routes/admin.routes");
require("./setup");
const FAQ = require("../models/FAQ");

const app = express();
app.use(express.json());
app.use("/api/admin", adminRoutes);

describe("Admin API Routes - Phase 1 (FAQs)", () => {
  

  describe("Middleware (authMiddleware)", () => {
    it("should return 401 if no token provided", async () => {
      const res = await request(app).post("/api/admin/faqs").send({});
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .post("/api/admin/faqs")
        .set("Authorization", "Bearer wrong-token")
        .send({});
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("POST /api/admin/faqs", () => {
    it("should fail with invalid payload (missing answer)", async () => {
      const payload = { question: "Test Q?", pageType: "Student" };
      const res = await request(app)
        .post("/api/admin/faqs")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it("should successfully create a FAQ", async () => {
      const payload = {
        question: "Test Q?",
        answer: "Test A!",
        pageType: "Student",
      };
      const res = await request(app)
        .post("/api/admin/faqs")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.question).toBe("Test Q?");
    });
  });

  describe("PUT /api/admin/faqs/:id", () => {
    let testFaq;
    beforeEach(async () => {
      testFaq = await FAQ.create({
        question: "Q1",
        answer: "A1",
        pageType: "Student",
      });
    });

    it("should update an existing FAQ", async () => {
      const res = await request(app)
        .put(`/api/admin/faqs/${testFaq._id}`)
        .set("Authorization", "Bearer valid-token")
        .send({ answer: "Updated A!" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.answer).toBe("Updated A!");
    });
  });

  describe("DELETE /api/admin/faqs/:id", () => {
    let testFaq;
    beforeEach(async () => {
      testFaq = await FAQ.create({
        question: "Q2",
        answer: "A2",
        pageType: "Company",
      });
    });

    it("should delete an FAQ", async () => {
      const res = await request(app)
        .delete(`/api/admin/faqs/${testFaq._id}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(200);

      // Verify deletion
      const faq = await FAQ.findById(testFaq._id);
      expect(faq).toBeNull();
    });
  });
});

const PartnerLogo = require("../models/PartnerLogo");

describe("Admin API Routes - Phase 2 (PartnerLogos via Generic CRUD)", () => {
  

  describe("POST /api/admin/partner-logos", () => {
    it("should successfully create a PartnerLogo", async () => {
      const payload = {
        name: "Tech Corp",
        logoUrl: "https://example.com/logo.png",
        category: "Technology Partner",
      };
      const res = await request(app)
        .post("/api/admin/partner-logos")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Tech Corp");
    });
  });

  describe("PUT /api/admin/partner-logos/:id", () => {
    let testLogo;
    beforeEach(async () => {
      testLogo = await PartnerLogo.create({
        name: "Old Corp",
        logoUrl: "https://example.com/old.png",
        category: "Business Partner",
      });
    });

    it("should update an existing PartnerLogo", async () => {
      const res = await request(app)
        .put(`/api/admin/partner-logos/${testLogo._id}`)
        .set("Authorization", "Bearer valid-token")
        .send({ name: "New Corp" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("New Corp");
    });
  });

  describe("DELETE /api/admin/partner-logos/:id", () => {
    let testLogo;
    beforeEach(async () => {
      testLogo = await PartnerLogo.create({
        name: "Delete Corp",
        logoUrl: "https://example.com/del.png",
        category: "College",
      });
    });

    it("should delete a PartnerLogo", async () => {
      const res = await request(app)
        .delete(`/api/admin/partner-logos/${testLogo._id}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(200);

      const logo = await PartnerLogo.findById(testLogo._id);
      expect(logo).toBeNull();
    });
  });
});
