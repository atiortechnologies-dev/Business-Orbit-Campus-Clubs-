/**
 * @file incubatorDiscovery.controller.js
 * @description Controllers for Incubator Discovery, Search, and Filtering APIs.
 * @architecture Handles public/student discovery of approved incubation programs with pagination and multi-field filtering.
 */

const IncubatorProfile = require("../models/IncubatorProfile");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * Helper function to build query and execute paginated search for incubators.
 */
const executeIncubatorSearch = async (queryParams) => {
  const {
    search,
    industry,
    stage,
    location,
    sort = "latest",
    page = 1,
    limit = 10,
  } = queryParams;

  const query = { is_approved: true };

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { incubator_name: searchRegex },
      { organization: searchRegex },
      { description: searchRegex },
      { bio: searchRegex },
    ];
  }

  if (industry && industry.trim() !== "") {
    const indRegex = new RegExp(industry.trim(), "i");
    query.$or = [
      { industry_focus: indRegex },
      { supported_startup_domains: indRegex },
    ];
  }

  if (stage && stage.trim() !== "") {
    const stageRegex = new RegExp(stage.trim(), "i");
    query.supported_stages = stageRegex;
  }

  if (location && location.trim() !== "") {
    const locRegex = new RegExp(location.trim(), "i");
    query.$or = [{ location: locRegex }, { city: locRegex }];
  }

  let sortOption = { created_at: -1 };
  if (sort === "deadline") {
    sortOption = { application_deadline: 1 };
  } else if (sort === "latest") {
    sortOption = { created_at: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await IncubatorProfile.countDocuments(query);
  const incubators = await IncubatorProfile.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .select(
      "user_id incubator_name organization city location profile_photo logo description bio website industry_focus supported_startup_domains supported_stages application_deadline is_approved created_at",
    );

  // Format response cards as required by PRD
  const formattedData = incubators.map((doc) => {
    const obj = doc.toObject();
    return {
      incubator_id: obj._id,
      user_id: obj.user_id,
      name: obj.incubator_name || obj.organization,
      logo: obj.logo || obj.profile_photo || "",
      description: obj.description || obj.bio || "",
      industry_focus: obj.industry_focus?.length
        ? obj.industry_focus
        : obj.supported_startup_domains || [],
      supported_stages: obj.supported_stages || [],
      location: obj.location || obj.city || "",
      application_deadline: obj.application_deadline || null,
      website: obj.website || "",
      created_at: obj.created_at,
    };
  });

  return {
    total,
    count: formattedData.length,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    data: formattedData,
  };
};

/**
 * @route   GET /api/incubators
 * @desc    Display all approved incubation programs with search, filter, and pagination
 * @access  Public / Student
 */
const getIncubators = asyncHandler(async (req, res) => {
  const result = await executeIncubatorSearch(req.query);
  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * @route   POST /api/incubators/filter
 * @desc    Filter incubators via POST body payload
 * @access  Public / Student
 */
const filterIncubators = asyncHandler(async (req, res) => {
  const result = await executeIncubatorSearch(
    req.body || req.validatedData || {},
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * @route   GET /api/incubators/:id
 * @desc    Load complete incubator information by ID
 * @access  Public / Student
 */
const getIncubatorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let incubator = await IncubatorProfile.findById(id);
  if (!incubator) {
    incubator = await IncubatorProfile.findOne({ user_id: id });
  }

  if (!incubator || !incubator.is_approved) {
    return res.status(404).json({
      success: false,
      message: "Incubator program not found or not approved",
    });
  }

  const obj = incubator.toObject();
  const detailData = {
    incubator_id: obj._id,
    user_id: obj.user_id,
    name: obj.incubator_name || obj.organization,
    logo: obj.logo || obj.profile_photo || "",
    description: obj.description || obj.bio || "",
    industry_focus: obj.industry_focus?.length
      ? obj.industry_focus
      : obj.supported_startup_domains || [],
    supported_stages: obj.supported_stages || [],
    location: obj.location || obj.city || "",
    application_deadline: obj.application_deadline || null,
    website: obj.website || "",
    services_offered: obj.services_offered || [],
    contact_person: obj.contact_person || "",
    linkedin_url: obj.linkedin_url || "",
    portfolio_url: obj.portfolio_url || "",
    created_at: obj.created_at,
  };

  res.status(200).json({
    success: true,
    data: detailData,
  });
});

module.exports = {
  getIncubators,
  filterIncubators,
  getIncubatorById,
};
