/**
 * @file studentInvestor.routes.js
 * @description Routes for students to discover and view investors.
 */

const express = require("express");
const router = express.Router();

const {
  getAllInvestors,
  searchInvestors,
  filterInvestors,
  getInvestorById,
  getInvestorPortfolio
} = require("../controllers/studentInvestor.controller");

// @route   GET /api/student/investors
// @desc    List all approved investors
// @access  Private (Student)
router.get("/", getAllInvestors);

// @route   GET /api/student/investors/search
// @desc    Keyword search investors
// @access  Private (Student)
router.get("/search", searchInvestors);

// @route   POST /api/student/investors/filter
// @desc    Advanced filtering of investors
// @access  Private (Student)
router.post("/filter", filterInvestors);

// @route   GET /api/student/investors/:investorId
// @desc    Get detailed investor profile
// @access  Private (Student)
router.get("/:investorId", getInvestorById);

// @route   GET /api/student/investors/:investorId/profile
// @desc    Alias for full profile
// @access  Private (Student)
router.get("/:investorId/profile", getInvestorById);

// @route   GET /api/student/investors/:investorId/portfolio
// @desc    Get investor portfolio details
// @access  Private (Student)
router.get("/:investorId/portfolio", getInvestorPortfolio);

module.exports = router;
