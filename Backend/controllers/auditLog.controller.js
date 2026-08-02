/**
 * @file auditLog.controller.js
 * @description Controllers for the Audit Log APIs
 * @architecture Implements endpoints for fetching paginated logs, pulse, volume trend, and exporting.
 */

const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../middlewares/asyncHandler");

// Utility to parse timeframe string into Date
const getDateFromTimeframe = (timeframe) => {
  if (!timeframe) return null;
  const now = new Date();
  if (timeframe === "24h") {
    now.setHours(now.getHours() - 24);
    return now;
  }
  if (timeframe === "7d") {
    now.setDate(now.getDate() - 7);
    return now;
  }
  if (timeframe === "30d") {
    now.setDate(now.getDate() - 30);
    return now;
  }
  return null;
};

/**
 * @description Fetch paginated list of system audit logs with filters
 * @route GET /api/admin/audit-log
 * @access Private (Admin/SuperAdmin)
 */
exports.getLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, timeframe, module: logModule, user } = req.query;

  const query = {};
  
  const fromDate = getDateFromTimeframe(timeframe);
  if (fromDate) {
    query.created_at = { $gte: fromDate };
  }
  
  if (logModule) {
    query.module = logModule.toUpperCase();
  }
  
  if (user) {
    query.actor_id = user;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [auditLogs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AuditLog.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: {
      auditLogs: auditLogs.map(log => ({
        _id: log._id,
        timestamp: log.created_at,
        actor_id: log.actor_id,
        actor_name: log.actor_name,
        module: log.module,
        action: log.action,
        target_entity_id: log.target_entity_id,
        target_entity_name: log.target_entity_name,
        status: log.status,
        ip_address: log.ip_address,
        details: log.details
      })),
      total,
      page: pageNum,
      totalPages
    }
  });
});

/**
 * @description Fetch recent activity pulse stream
 * @route GET /api/admin/audit-log/pulse
 * @access Private (Admin/SuperAdmin)
 */
exports.getPulse = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const limitNum = parseInt(limit, 10) || 10;

  const logs = await AuditLog.find({})
    .sort({ created_at: -1 })
    .limit(limitNum)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      pulse: logs.map(log => ({
        _id: log._id,
        timestamp: log.created_at,
        actor_name: log.actor_name,
        action: log.action,
        module: log.module
      }))
    }
  });
});

/**
 * @description Fetch 24-hour log volume histogram data
 * @route GET /api/admin/audit-log/volume-trend
 * @access Private (Admin/SuperAdmin)
 */
exports.getVolumeTrend = asyncHandler(async (req, res) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const aggregateResult = await AuditLog.aggregate([
    { $match: { created_at: { $gte: twentyFourHoursAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$created_at" },
          month: { $month: "$created_at" },
          day: { $dayOfMonth: "$created_at" },
          hour: { $hour: "$created_at" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
  ]);

  const trend = aggregateResult.map(item => {
    // Format to ISO string for the specific hour
    const date = new Date(Date.UTC(item._id.year, item._id.month - 1, item._id.day, item._id.hour));
    return {
      time: date.toISOString(),
      count: item.count
    };
  });

  res.status(200).json({
    success: true,
    data: {
      trend
    }
  });
});

/**
 * @description Download audit logs as CSV file
 * @route GET /api/admin/audit-log/export
 * @access Private (SuperAdmin only)
 */
exports.exportLogs = asyncHandler(async (req, res) => {
  const { timeframe, module: logModule, user } = req.query;

  const query = {};
  
  const fromDate = getDateFromTimeframe(timeframe);
  if (fromDate) {
    query.created_at = { $gte: fromDate };
  }
  
  if (logModule) {
    query.module = logModule.toUpperCase();
  }
  
  if (user) {
    query.actor_id = user;
  }

  const logs = await AuditLog.find(query).sort({ created_at: -1 }).lean();

  // Very simple CSV conversion. In real-world, json2csv is better.
  const fields = ['ID', 'Timestamp', 'Actor ID', 'Actor Name', 'Module', 'Action', 'Target Entity ID', 'Target Entity Name', 'Status', 'IP Address', 'Details'];
  const csvLines = [];
  
  // Create Header
  csvLines.push(fields.join(','));

  // Fill data
  logs.forEach(log => {
    const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
    const line = [
      log._id.toString(),
      log.created_at ? log.created_at.toISOString() : '',
      log.actor_id ? log.actor_id.toString() : '',
      `"${(log.actor_name || '').replace(/"/g, '""')}"`,
      `"${log.module || ''}"`,
      `"${(log.action || '').replace(/"/g, '""')}"`,
      `"${log.target_entity_id || ''}"`,
      `"${(log.target_entity_name || '').replace(/"/g, '""')}"`,
      log.status,
      log.ip_address || '',
      `"${details}"`
    ];
    csvLines.push(line.join(','));
  });

  const csvContent = csvLines.join('\\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('audit_logs.csv');
  res.status(200).send(csvContent);
});
