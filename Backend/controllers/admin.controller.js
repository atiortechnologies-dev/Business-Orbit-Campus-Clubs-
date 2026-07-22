/**
 * @file admin.controller.js
 * @description Handles business logic for administrative operations, user management, and dynamic content updates.
 * @architecture Centralizes privileged operations, ensuring that business logic requiring elevated permissions is naturally isolated.
 */

const FAQ = require("../models/FAQ");
const {
  createFaqSchema,
  updateFaqSchema,
} = require("../utils/adminValidators");

/**
 * @route   POST /api/admin/faqs
 * @desc    Create a new FAQ
 * @access  Private (Admin)
 */
exports.createFaq = async (req, res, next) => {
  try {
    const validatedData = createFaqSchema.parse(req.body);
    const faq = await FAQ.create(validatedData);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    if (error.name === "ZodError")
      return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

/**
 * @route   PUT /api/admin/faqs/:id
 * @desc    Update an existing FAQ
 * @access  Private (Admin)
 */
exports.updateFaq = async (req, res, next) => {
  try {
    const validatedData = updateFaqSchema.parse(req.body);
    const faq = await FAQ.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!faq)
      return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    if (error.name === "ZodError")
      return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/faqs/:id
 * @desc    Delete an FAQ
 * @access  Private (Admin)
 */
exports.deleteFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq)
      return res.status(404).json({ success: false, message: "FAQ not found" });
    res
      .status(200)
      .json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};

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
