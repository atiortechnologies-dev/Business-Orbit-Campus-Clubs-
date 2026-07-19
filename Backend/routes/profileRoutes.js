const express = require("express");
const profileController = require("../controllers/profileController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

const createProfileRouter = (role) => {
  const router = express.Router();

  router.use(protect, requireRole(role));

  router.get("/", profileController.getMyProfile);
  router.post("/", profileController.createProfile);
  router.put("/", profileController.updateProfile);

  //   router.post("/photo", profileController.uploadPhoto);
  //   router.delete("/photo", profileController.deletePhoto);

  router.post("/skip", profileController.skipProfile);

  return router;
};

module.exports = { createProfileRouter };
