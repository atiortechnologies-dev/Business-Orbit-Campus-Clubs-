/**
 * @file studentInvestor.controller.js
 * @description Controllers for students/startups to discover and view investors.
 */

const InvestorProfile = require("../models/InvestorProfile");
const User = require("../models/User");

/**
 * @function getAllInvestors
 * @description List all approved investors with basic info
 */
exports.getAllInvestors = async (req, res, next) => {
  try {
    const investors = await InvestorProfile.find({ account_status: "approved" })
      .populate("user_id", "full_name email")
      .select(
        "user_id organization investment_range investment_sectors investment_stage investor_type profile_photo location",
      );

    res
      .status(200)
      .json({ success: true, count: investors.length, data: investors });
  } catch (error) {
    next(error);
  }
};

/**
 * @function searchInvestors
 * @description Keyword search investors by organization or name
 */
exports.searchInvestors = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Keyword query parameter is required",
        });
    }

    const regex = new RegExp(keyword, "i");

    // First find matching users
    const users = await User.find({
      role: "investor",
      full_name: regex,
    }).select("_id");
    const userIds = users.map((u) => u._id);

    // Then find investor profiles matching org OR user_id
    const investors = await InvestorProfile.find({
      account_status: "approved",
      $or: [{ organization: regex }, { user_id: { $in: userIds } }],
    })
      .populate("user_id", "full_name email")
      .select(
        "user_id organization investment_range investment_sectors investment_stage investor_type profile_photo location",
      );

    res
      .status(200)
      .json({ success: true, count: investors.length, data: investors });
  } catch (error) {
    next(error);
  }
};

/**
 * @function filterInvestors
 * @description Advanced filtering of investors
 */
exports.filterInvestors = async (req, res, next) => {
  try {
    const { sectors, stage, type, min_funding } = req.body;

    let query = { account_status: "approved" };

    if (sectors && sectors.length > 0) {
      query.investment_sectors = { $in: sectors };
    }
    if (stage) {
      query.investment_stage = stage;
    }
    if (type) {
      query.investor_type = type;
    }
    // Very basic funding filter assuming textual match or we can just leave it out if complex
    if (min_funding) {
      query.funding_range = new RegExp(min_funding, "i");
    }

    const investors = await InvestorProfile.find(query)
      .populate("user_id", "full_name email")
      .select(
        "user_id organization investment_range investment_sectors investment_stage investor_type profile_photo location",
      );

    res
      .status(200)
      .json({ success: true, count: investors.length, data: investors });
  } catch (error) {
    next(error);
  }
};

/**
 * @function getInvestorById
 * @description Get detailed investor profile (Alias for /profile)
 */
exports.getInvestorById = async (req, res, next) => {
  try {
    const { investorId } = req.params;

    const investor = await InvestorProfile.findOne({
      user_id: investorId,
      account_status: "approved",
    }).populate("user_id", "full_name email");

    if (!investor) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Investor not found or not approved",
        });
    }

    res.status(200).json({ success: true, data: investor });
  } catch (error) {
    next(error);
  }
};

/**
 * @function getInvestorPortfolio
 * @description Get investor portfolio details
 */
exports.getInvestorPortfolio = async (req, res, next) => {
  try {
    const { investorId } = req.params;

    const investor = await InvestorProfile.findOne({
      user_id: investorId,
      account_status: "approved",
    }).select("portfolio_details");

    if (!investor) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Investor not found or not approved",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        portfolio:
          investor.portfolio_details || "No portfolio details available.",
      });
  } catch (error) {
    next(error);
  }
};
