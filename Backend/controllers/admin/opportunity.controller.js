const { logAudit } = require('../../services/auditLoggerService');
const FreelanceOpportunity = require('../../models/FreelanceOpportunity');
const OpportunityNote = require('../../models/OpportunityNote');
const asyncHandler = require('../../middlewares/asyncHandler');

/**
 * @function getOpportunities
 * @description List paginated opportunity moderation queue with search and filter
 */
exports.getOpportunities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, company_id, type, status, date_from, date_to } = req.query;

  const query = {};
  if (company_id) query.company_id = company_id;
  if (type) query.opportunity_type = type;
  if (status) query.status = status;
  
  if (date_from || date_to) {
    query.created_at = {};
    if (date_from) query.created_at.$gte = new Date(date_from);
    if (date_to) query.created_at.$lte = new Date(date_to);
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total_records = await FreelanceOpportunity.countDocuments(query);
  const total_pages = Math.ceil(total_records / limitNum);

  const opportunities = await FreelanceOpportunity.find(query)
    .populate('company_id', 'first_name last_name email company_name')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limitNum);

  // metricCards
  const [pending, approved, rejected, drafts] = await Promise.all([
    FreelanceOpportunity.countDocuments({ status: 'PENDING' }),
    FreelanceOpportunity.countDocuments({ status: 'ACTIVE' }),
    FreelanceOpportunity.countDocuments({ status: 'REJECTED' }),
    FreelanceOpportunity.countDocuments({ status: 'DRAFT' })
  ]);

  res.status(200).json({
    message: "Opportunities retrieved successfully",
    data: {
      opportunities,
      page: pageNum,
      limit: limitNum,
      total_records,
      total_pages,
      queueVelocity: {}, // Mock
      metricCards: { pending, approved, rejected, drafts }
    }
  });
});

/**
 * @function getOpportunityDetails
 * @description Get complete details for an opportunity review
 */
exports.getOpportunityDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await FreelanceOpportunity.findById(id).populate('company_id');
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  const notes = await OpportunityNote.find({ opportunity_id: id }).populate('author_id', 'first_name last_name email').sort({ created_at: -1 });
  
  res.status(200).json({
    message: "Opportunity details retrieved successfully",
    data: {
      opportunity,
      companyProfile: opportunity.company_id,
      notes,
      auditHistory: [] // To be fetched from AuditLog if required
    }
  });
});

/**
 * @function approveOpportunity
 * @description Approve opportunity
 */
exports.approveOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const opportunity = await FreelanceOpportunity.findById(id);
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  opportunity.status = 'ACTIVE';
  opportunity.assigned_reviewer_id = req.user._id;
  await opportunity.save();

  await logAudit(
    req.user._id,
    'OpportunityModeration',
    'OPPORTUNITY_APPROVED',
    opportunity._id,
    'FreelanceOpportunity',
    'SUCCESS',
    req.ip || '0.0.0.0',
    { title: opportunity.title }
  );

  res.status(200).json({
    message: "Opportunity approved successfully",
    data: { opportunity }
  });
});

/**
 * @function rejectOpportunity
 * @description Reject opportunity
 */
exports.rejectOpportunity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: "Reason is required" });
  }

  const opportunity = await FreelanceOpportunity.findById(id);
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  opportunity.status = 'REJECTED';
  opportunity.assigned_reviewer_id = req.user._id;
  await opportunity.save();

  await logAudit(
    req.user._id,
    'OpportunityModeration',
    'OPPORTUNITY_REJECTED',
    opportunity._id,
    'FreelanceOpportunity',
    'SUCCESS',
    req.ip || '0.0.0.0',
    { reason }
  );

  res.status(200).json({
    message: "Opportunity rejected successfully",
    data: { opportunity }
  });
});

/**
 * @function requestChanges
 * @description Request modifications for an opportunity
 */
exports.requestChanges = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { changes_requested } = req.body;

  if (!changes_requested) {
    return res.status(400).json({ message: "Changes requested is required" });
  }

  const opportunity = await FreelanceOpportunity.findById(id);
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  opportunity.status = 'CHANGES_REQUESTED';
  opportunity.assigned_reviewer_id = req.user._id;
  await opportunity.save();

  await logAudit(
    req.user._id,
    'OpportunityModeration',
    'OPPORTUNITY_CHANGES_REQUESTED',
    opportunity._id,
    'FreelanceOpportunity',
    'SUCCESS',
    req.ip || '0.0.0.0',
    { changes_requested }
  );

  res.status(200).json({
    message: "Changes requested successfully",
    data: { opportunity }
  });
});

/**
 * @function addNote
 * @description Add private review note
 */
exports.addNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { note_text } = req.body;

  if (!note_text) {
    return res.status(400).json({ message: "Note text is required" });
  }

  const opportunity = await FreelanceOpportunity.findById(id);
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  const note = await OpportunityNote.create({
    opportunity_id: opportunity._id,
    author_id: req.user._id,
    note_text
  });

  res.status(201).json({
    message: "Note added successfully",
    data: { note }
  });
});

/**
 * @function bulkApprove
 * @description Bulk approve multiple listings
 */
exports.bulkApprove = asyncHandler(async (req, res) => {
  const { opportunity_ids } = req.body;

  if (!Array.isArray(opportunity_ids) || opportunity_ids.length === 0) {
    return res.status(400).json({ message: "An array of opportunity_ids is required" });
  }

  const result = await FreelanceOpportunity.updateMany(
    { _id: { $in: opportunity_ids }, status: { $ne: 'ACTIVE' } },
    { $set: { status: 'ACTIVE', assigned_reviewer_id: req.user._id } }
  );

  // Note: For full audit logging, one might log each approval separately or log a bulk action.
  await logAudit(
    req.user._id,
    'OpportunityModeration',
    'OPPORTUNITY_BULK_APPROVED',
    req.user._id, // generic target for bulk
    'BulkAction',
    'SUCCESS',
    req.ip || '0.0.0.0',
    { count: result.modifiedCount, ids: opportunity_ids }
  );

  res.status(200).json({
    message: "Opportunities bulk approved successfully",
    data: { approved_count: result.modifiedCount }
  });
});
