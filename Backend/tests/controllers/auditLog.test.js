const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const AuditLog = require("../../models/AuditLog");
const { generateToken } = require("../../utils/token");

describe("AuditLog Controller", () => {
  let adminJwt;
  let adminId;

  beforeEach(async () => {
    await User.deleteMany({});
    await AuditLog.deleteMany({});

    const admin = await User.create({
      full_name: "Admin User",
      email: "admin@example.com",
      password_hash: "hashedpass",
      role: "admin",
      account_status: "active",
      email_verified: true,
    });
    adminId = admin._id;
    adminJwt = generateToken(admin, "admin@example.com");

    await AuditLog.create([
      {
        actor_id: adminId,
        actor_name: "Admin User",
        module: "SYSTEM",
        action: "TEST_ACTION_1",
        target_entity_name: "Test",
        status: "SUCCESS",
        ip_address: "127.0.0.1",
        created_at: new Date(Date.now() - 3600 * 1000),
      },
      {
        actor_id: adminId,
        actor_name: "Admin User",
        module: "AUTH",
        action: "TEST_ACTION_2",
        target_entity_name: "Test2",
        status: "SUCCESS",
        ip_address: "127.0.0.1",
        created_at: new Date(Date.now() - 48 * 3600 * 1000), // 2 days ago
      },
    ]);
  });

  describe("getAuditLogs", () => {
    it("should get paginated logs", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.auditLogs).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(2);
    });

    it("should filter by timeframe Last 24 Hours", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log?timeframe=Last 24 Hours")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.auditLogs).toHaveLength(1);
    });

    it("should filter by module", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log?module=SYSTEM")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.auditLogs).toHaveLength(1);
    });

    it("should filter by user", async () => {
      const res = await request(app)
        .get(`/api/admin/audit-log?user=${adminId}`)
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.auditLogs).toHaveLength(2);
    });
  });

  describe.skip("getPulse", () => {
    it("should initiate SSE stream", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log/pulse")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe(
        "text/event-stream; charset=utf-8",
      );
    });
  });

  describe("getVolumeTrend", () => {
    it("should get volume trend data", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log/volume-trend")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.trend)).toBe(true);
    });
  });

  describe("exportLogs", () => {
    it("should export logs as CSV", async () => {
      const res = await request(app)
        .get("/api/admin/audit-log/export")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toBe("text/csv; charset=utf-8");
      expect(res.text).toContain("created_at,actor_name,module");
    });
  });
});
