const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getMyProfile,
  createProfile,
  updateProfile,
  skipProfile,
} = require("../controllers/profile.controller");

const createProfileRouter = (role) => {
  const router = express.Router();

  router.use(protect, requireRole(role));

  // GET api/{role}/profile ( getProfile )
  router.get("/", getMyProfile);

  // POST api/{role}/profile ( createProfile )
  router.post("/", createProfile);

  // PUT api/{role}/profile ( updateProfile )
  router.put("/", updateProfile);

  //   router.post("/photo", uploadPhoto);
  //   router.delete("/photo", deletePhoto);

  // POST api/{role}/profile/skip
  router.post("/skip", skipProfile);

  return router;
};

module.exports = { createProfileRouter };
