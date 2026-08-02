/**
 * @file companyOpportunity.controller.js
 * @description Controller for Company Opportunity CRUD and Discovery lifecycle.
 * @architecture Manages opportunities posted by companies and integrates cascade deletion for dependent applications.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Opportunity = require("../models/Opportunity");
const cascadeService = require("../services/cascadeService");

/**
 * @desc    Create a new opportunity
 * @route   POST /api/company/opportunities
 * @access  Private (Company)
 */
exports.createOpportunity = asyncHandler(async (req, res) => {
  const oppData = req.validatedData || req.body;
  const opportunity = await Opportunity.create({
    ...oppData,
    company_id: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Opportunity created successfully",
    data: opportunity,
  });
});

/**
 * @desc    Get all opportunities posted by the authenticated company
 * @route   GET /api/company/opportunities
 * @access  Private (Company)
 */
exports.getMyOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({
    company_id: req.user._id,
  }).sort({
    created_at: -1,
  });

  res.status(200).json({
    success: true,
    count: opportunities.length,
    data: opportunities,
  });
});

/**
 * @desc    Get an opportunity by ID
 * @route   GET /api/company/opportunities/:id or GET /api/student/opportunities/:id
 * @access  Private
 */
exports.getOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    return res
      .status(404)
      .json({ success: false, message: "Opportunity not found" });
  }

  res.status(200).json({
    success: true,
    data: opportunity,
  });
});

/**
 * @desc    Update an existing opportunity
 * @route   PUT /api/company/opportunities/:id
 * @access  Private (Company)
 */
exports.updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findOne({
    _id: req.params.id,
    company_id: req.user._id,
  });

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: "Opportunity not found or unauthorized",
    });
  }

  const updateData = req.validatedData || req.body;
  Object.assign(opportunity, updateData);
  await opportunity.save();

  res.status(200).json({
    success: true,
    message: "Opportunity updated successfully",
    data: opportunity,
  });
});

/**
 * @desc    Delete an opportunity and cascade delete dependent applications
 * @route   DELETE /api/company/opportunities/:id
 * @access  Private (Company)
 */
exports.deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findOne({
    _id: req.params.id,
    company_id: req.user._id,
  });

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: "Opportunity not found or unauthorized",
    });
  }

  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await cascadeService.deleteOpportunityDependencies(opportunity._id, session);
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get all open opportunities (for student discovery)
 * @route   GET /api/student/opportunities
 * @access  Private (Student)
 */
exports.getAllOpportunities = asyncHandler(async (req, res) => {
  const query = { status: "open" };

  if (req.query.type) {
    query.type = req.query.type;
  }

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const opportunities = await Opportunity.find(query).sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: opportunities.length,
    data: opportunities,
  });
});
