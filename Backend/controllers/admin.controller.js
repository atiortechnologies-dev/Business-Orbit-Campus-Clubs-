/**
 * @file admin.controller.js
 * @description Handles business logic for administrative operations, user management, and dynamic content updates.
 * @architecture Centralizes privileged operations, ensuring that business logic requiring elevated permissions is naturally isolated.
 */

const mongoose = require("mongoose");
const cascadeService = require("../services/cascadeService");
const FAQ = require("../models/FAQ");
const User = require("../models/User");
const ChapterChangeRequest = require("../models/ChapterChangeRequest");
const StudentProfile = require("../models/StudentProfile");
const {
  createFaqSchema,
  updateFaqSchema,
} = require("../utils/adminValidators");

// FAQ CRUD handled by generic resource helpers below

const Statistic = require("../models/Statistic");
const PartnerLogo = require("../models/PartnerLogo");
const SuccessStory = require("../models/SuccessStory");
const FeaturedStartup = require("../models/FeaturedStartup");
const {
  createStatisticSchema,
  updateStatisticSchema,
  createPartnerLogoSchema,
  updatePartnerLogoSchema,
  createSuccessStorySchema,
  updateSuccessStorySchema,
  createFeaturedStartupSchema,
  updateFeaturedStartupSchema,
} = require("../utils/adminValidators");

// Helper for generic CRUD operations to reduce duplication
const createResource = (Model, schema) => async (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    const doc = await Model.create(validatedData);
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    if (error.name === "ZodError")
      return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

const updateResource = (Model, schema) => async (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    if (error.name === "ZodError")
      return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

const deleteResource = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    res
      .status(200)
      .json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// FAQ CRUD
exports.createFaq = createResource(FAQ, createFaqSchema);
exports.updateFaq = updateResource(FAQ, updateFaqSchema);
exports.deleteFaq = deleteResource(FAQ);

// Statistics CRUD
exports.createStatistic = createResource(Statistic, createStatisticSchema);
exports.updateStatistic = updateResource(Statistic, updateStatisticSchema);
exports.deleteStatistic = deleteResource(Statistic);

// PartnerLogo CRUD
exports.createPartnerLogo = createResource(
  PartnerLogo,
  createPartnerLogoSchema,
);
exports.updatePartnerLogo = updateResource(
  PartnerLogo,
  updatePartnerLogoSchema,
);
exports.deletePartnerLogo = deleteResource(PartnerLogo);

// SuccessStory CRUD
exports.createSuccessStory = createResource(
  SuccessStory,
  createSuccessStorySchema,
);
exports.updateSuccessStory = updateResource(
  SuccessStory,
  updateSuccessStorySchema,
);
exports.deleteSuccessStory = deleteResource(SuccessStory);

// FeaturedStartup CRUD
exports.createFeaturedStartup = createResource(
  FeaturedStartup,
  createFeaturedStartupSchema,
);
exports.updateFeaturedStartup = updateResource(
  FeaturedStartup,
  updateFeaturedStartupSchema,
);
exports.deleteFeaturedStartup = deleteResource(FeaturedStartup);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a User (and automatically cascade delete all their dependencies)
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @route   GET /api/admin/chapter-change-requests
 * @desc    List chapter change requests with optional status filter
 * @access  Private (Admin)
 */
exports.listChapterChangeRequests = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await ChapterChangeRequest.countDocuments(query);
    const requests = await ChapterChangeRequest.find(query)
      .populate("student_id", "full_name email")
      .populate("current_chapter_id", "chapter_name college_name")
      .populate("requested_chapter_id", "chapter_name college_name")
      .sort({ created_at: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: requests.length,
      pagination: {
        total,
        page,
        limit,
      },
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/chapter-change-requests/:id
 * @desc    Get a single chapter change request by ID
 * @access  Private (Admin)
 */
exports.getChapterChangeRequest = async (req, res, next) => {
  try {
    const request = await ChapterChangeRequest.findById(req.params.id)
      .populate("student_id", "full_name email")
      .populate("current_chapter_id", "chapter_name college_name")
      .populate("requested_chapter_id", "chapter_name college_name");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter change request not found" });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/chapter-change-requests/:id/approve
 * @desc    Approve a chapter change request and update student's chapter atomically
 * @access  Private (Admin)
 */
exports.approveChapterChangeRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await ChapterChangeRequest.findById(req.params.id).session(
      session,
    );
    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Chapter change request not found" });
    }

    if (request.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = "approved";
    await request.save({ session });

    await StudentProfile.findOneAndUpdate(
      { user_id: request.student_id },
      { chapter_id: request.requested_chapter_id },
      { session },
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Chapter change request approved",
      data: request,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @route   PUT /api/admin/chapter-change-requests/:id/reject
 * @desc    Reject a chapter change request
 * @access  Private (Admin)
 */
exports.rejectChapterChangeRequest = async (req, res, next) => {
  try {
    const request = await ChapterChangeRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter change request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Chapter change request rejected",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
