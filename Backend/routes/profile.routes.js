/**
 * @file profile.routes.js
 * @description Implements a dynamic router factory for profile management.
 * @architecture Dynamically generates profile routers (get, create, update, skip) by injecting a specific role, promoting reusability.
 */

const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getMyProfile,
  createProfile,
  updateProfile,
  skipProfile,
  changePassword,
  updateNotificationPreferences,
  uploadPhoto,
} = require("../controllers/profile.controller");

/**
 * @desc    Factory function to create a profile router for a specific role
 * @param   {string} role - The user role (e.g., 'student', 'mentor', 'investor')
 * @returns {express.Router} Configured Express router
 */
const createProfileRouter = (role) => {
  const router = express.Router();

  router.use(protect, requireRole(role));

  // GET api/{role}/profile ( getProfile )
  router.get("/", getMyProfile);

  // POST api/{role}/profile ( createProfile )
  router.post("/", createProfile);

  // PUT api/{role}/profile ( updateProfile )
  router.put("/", updateProfile);

  // POST api/{role}/profile/upload-photo
  router.post("/upload-photo", uploadPhoto);

  // PUT api/{role}/profile/change-password
  router.put("/change-password", changePassword);

  // PUT api/{role}/profile/notification-preferences
  router.put("/notification-preferences", updateNotificationPreferences);

  // POST api/{role}/profile/skip
  router.post("/skip", skipProfile);

  return router;
};

module.exports = { createProfileRouter };
