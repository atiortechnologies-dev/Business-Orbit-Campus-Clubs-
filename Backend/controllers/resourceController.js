const asyncHandler = require("../middlewares/asyncHandler");
const Resource = require("../models/Resource");

//* GET /api/resources
//  Query params:
//  ?category=Pitch+Deck   -> filter by category
//  ?search=business+model -> text search across title + description
// Both are optional

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

//* GET /api/resources/:id
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
