/**
 * @file resource.controller.js
 * @description Manages the platform's resource library.
 * @architecture Provides endpoints to list resources and includes side-effects like incrementing download counts.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Resource = require("../models/Resource");

/**
 * @desc    List all available resources with optional category and search filters
 * @route   GET /api/resources
 * @access  Private (Student)
 */
const listResources = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const resources = await Resource.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: resources,
  });
});

/**
 * @desc    Get a specific resource by ID and increment its download count
 * @route   GET /api/resources/:id
 * @access  Private (Student)
 */
const getResourceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await Resource.findByIdAndUpdate(
    id,
    { $inc: { download_count: 1 } },
    { new: true },
  );

  if (!resource) {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  return res.status(200).json({
    success: true,
    data: resource,
  });
});

module.exports = { listResources, getResourceById };
