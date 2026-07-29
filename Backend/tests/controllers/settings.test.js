const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const PlatformSetting = require("../../models/PlatformSetting");
const AdminNotificationSetting = require("../../models/AdminNotificationSetting");
const UserSession = require("../../models/UserSession");
const AuditLog = require("../../models/AuditLog");
const { generateToken } = require("../../utils/token");
const { hashPassword } = require("../../utils/password");

describe("Settings Controller", () => {
  let adminJwt;
  let adminId;

  beforeEach(async () => {
    await User.deleteMany({});
    await PlatformSetting.deleteMany({});
    await AdminNotificationSetting.deleteMany({});
    await UserSession.deleteMany({});
    await AuditLog.deleteMany({});

    const password_hash = await hashPassword("CurrentPassword123");
    const admin = await User.create({
      full_name: "Admin User",
      email: "admin@example.com",
      password_hash,
      role: "admin",
      account_status: "active",
      email_verified: true,
    });
    adminId = admin._id;
    adminJwt = generateToken(admin, "admin@example.com");
  });

  describe("getSettings", () => {
    it("should get settings, profile, and notifications", async () => {
      const res = await request(app)
        .get("/api/admin/settings")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.full_name).toBe("Admin User");
    });
  });

  describe("updatePlatformSettings", () => {
    // Only super_admin can do this
    it("should update platform settings as super_admin", async () => {
      const superAdmin = await User.create({
        full_name: "Super Admin",
        email: "superadmin@example.com",
        password_hash: "hashedpass",
        role: "super_admin",
        account_status: "active",
        email_verified: true,
      });
      const superAdminJwt = generateToken(superAdmin, "superadmin@example.com");

      const res = await request(app)
        .put("/api/admin/settings/platform")
        .set("Authorization", `Bearer ${superAdminJwt}`)
        .send({
          platform_name: "New Name",
          maintenance_mode: true
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.platformSetting.platform_name).toBe("New Name");
      expect(res.body.data.platformSetting.maintenance_mode).toBe(true);
      
      const logs = await AuditLog.find();
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe("updateProfile", () => {
    it("should update admin profile", async () => {
      const res = await request(app)
        .put("/api/admin/settings/profile")
        .set("Authorization", `Bearer ${adminJwt}`)
        .send({
          full_name: "Updated Admin",
          phone: "1234567890"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.profile.full_name).toBe("Updated Admin");
      expect(res.body.data.profile.phone).toBe("1234567890");
    });
  });

  describe("updateNotifications", () => {
    it("should update notification settings", async () => {
      const res = await request(app)
        .put("/api/admin/settings/notifications")
        .set("Authorization", `Bearer ${adminJwt}`)
        .send({
          notifications: [
            { event_category: "user_registrations", in_app_enabled: true, email_enabled: false }
          ]
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.notifications).toHaveLength(1);
      expect(res.body.data.notifications[0].event_category).toBe("user_registrations");
    });
  });

  describe("getLoginHistory", () => {
    it("should get login history", async () => {
      await UserSession.create({
        user_id: adminId,
        device_name: "Test Device",
        os_browser: "Test OS",
        ip_address: "127.0.0.1",
        refresh_token_hash: "hash",
        is_current: true,
        last_active_at: new Date()
      });

      const res = await request(app)
        .get("/api/admin/settings/login-history")
        .set("Authorization", `Bearer ${adminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.sessions).toHaveLength(1);
    });
  });

  describe("logoutAllDevices", () => {
    it("should logout all devices except current as super admin", async () => {
      const superAdmin = await User.create({
        full_name: "Super Admin",
        email: "superadmin@example.com",
        password_hash: "hashedpass",
        role: "super_admin",
        account_status: "active",
        email_verified: true,
      });
      const superAdminJwt = generateToken(superAdmin, "superadmin@example.com");
      
      const currentRefreshToken = "current-refresh-token-123";
      const crypto = require("crypto");
      const currentHash = crypto.createHash('sha256').update(currentRefreshToken).digest('hex');

      await UserSession.create({
        user_id: superAdmin._id,
        device_name: "Test Device",
        os_browser: "Test OS",
        ip_address: "127.0.0.1",
        refresh_token_hash: currentHash,
        is_current: true,
        last_active_at: new Date()
      });

      // Add a non-current session
      await UserSession.create({
        user_id: superAdmin._id,
        device_name: "Old Device",
        os_browser: "Test OS",
        ip_address: "127.0.0.1",
        refresh_token_hash: "oldhash",
        is_current: false,
        last_active_at: new Date()
      });

      const res = await request(app)
        .post("/api/admin/settings/logout-all-devices")
        .set("Authorization", `Bearer ${superAdminJwt}`)
        .send({ refreshToken: currentRefreshToken });

      expect(res.statusCode).toBe(200);
      const sessions = await UserSession.find({ user_id: superAdmin._id });
      expect(sessions).toHaveLength(1);
      expect(sessions[0].refresh_token_hash).toBe(currentHash);
    });
    
    it("should fail if no refreshToken is provided", async () => {
      const superAdmin = await User.create({
        full_name: "Super Admin 2",
        email: "superadmin2@example.com",
        password_hash: "hashedpass",
        role: "super_admin",
        account_status: "active",
        email_verified: true,
      });
      const superAdminJwt = generateToken(superAdmin, "superadmin2@example.com");

      const res = await request(app)
        .post("/api/admin/settings/logout-all-devices")
        .set("Authorization", `Bearer ${superAdminJwt}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("changePassword", () => {
    it("should change password", async () => {
      const res = await request(app)
        .post("/api/admin/settings/change-password")
        .set("Authorization", `Bearer ${adminJwt}`)
        .send({
          current_password: "CurrentPassword123",
          new_password: "NewPassword123!"
        });

      expect(res.statusCode).toBe(200);
    });

    it("should fail with incorrect current password", async () => {
      const res = await request(app)
        .post("/api/admin/settings/change-password")
        .set("Authorization", `Bearer ${adminJwt}`)
        .send({
          current_password: "WrongPassword123",
          new_password: "NewPassword123!"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("downloadSystemLogs", () => {
    it("should download logs as super_admin", async () => {
      const superAdmin = await User.create({
        full_name: "Super Admin",
        email: "superadmin@example.com",
        password_hash: "hashedpass",
        role: "super_admin",
        account_status: "active",
        email_verified: true,
      });
      const superAdminJwt = generateToken(superAdmin, "superadmin@example.com");

      const res = await request(app)
        .get("/api/admin/settings/download-system-logs")
        .set("Authorization", `Bearer ${superAdminJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("System started");
    });
  });
});
