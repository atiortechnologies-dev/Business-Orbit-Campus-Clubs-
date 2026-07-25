const asyncHandler = require("../../middlewares/asyncHandler");
const StartupProduct = require("../../models/StartupProduct");
const { getOrCreateStartup } = require("../../utils/startupJourney");
const MVPChecklist = require("../models/MVPChecklist");

// POST /api/student/startup/product-type
const selectProductType = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { product_type, product_description } = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check if product type already selected
  let product = await StartupProduct.findOne({ startup_id: startup._id });

  if (product) {
    // Update existing
    product.product_type = product_type;
    product.product_description = product_description || "";
    product.updated_at = new Date();
    await product.save();
  } else {
    // Create new
    product = new StartupProduct({
      startup_id: startup._id,
      student_id: userId,
      product_type,
      product_description: product_description || "",
    });
    await product.save();

    // Mark checklist item as completed
    const checklist = await MVPChecklist.findOne({ startup_id: startup._id });
    if (checklist) {
      const item = checklist.items.find(
        (i) => i.name === "Select Product Type",
      );
      if (item) {
        item.is_completed = true;
        item.completed_at = new Date();
        await checklist.save();
      }
    }
  }

  res.status(201).json({
    success: true,
    message: "Product type selected successfully",
    data: {
      product_type: product.product_type,
      product_description: product.product_description,
      selected_at: product.selected_at,
    },
  });
});

// GET /api/student/startup/product-type
const getProductType = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const product = await StartupProduct.findOne({
    startup_id: startup._id,
  }).lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product type not selected yet",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  selectProductType,
  getProductType,
};
